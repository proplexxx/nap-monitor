"""Nap Monitor: multi-child, multi-camera nursery monitor for Home Assistant.

Phase 0: the integration only serves the dashboard card and exposes a websocket
command that reports the installed version. Children, locations and cameras are
still configured on the card itself (YAML). Later phases move that model here.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from .const import (
    DATA_FRONTEND_REGISTERED,
    DOMAIN,
    FRONTEND_DIR,
    FRONTEND_URL,
    FRONTEND_URL_BASE,
)
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[str] = []


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the card bundle and websocket API once per Home Assistant run."""
    await _async_register_frontend(hass)
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the household config entry."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {}
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the household config entry."""
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return True


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Serve custom_components/nap_monitor/frontend and load the card on every dashboard."""
    if hass.data.get(DATA_FRONTEND_REGISTERED):
        return
    hass.data[DATA_FRONTEND_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    version = integration.version or "0"
    frontend_path = Path(__file__).parent / FRONTEND_DIR

    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_BASE, str(frontend_path), cache_headers=False)]
    )
    # The version query string busts browser caches on every release.
    url = f"{FRONTEND_URL}?v={version}"
    # Extra modules arrive with a freshly served page; dashboard resources are fetched
    # on every dashboard load, which is what a companion app holding a cached app
    # shell still does. Register both so either path loads the same URL.
    add_extra_js_url(hass, url)
    await _async_register_resource(hass, url)
    _LOGGER.debug("Nap Monitor card %s served from %s", version, url)


async def _async_register_resource(hass: HomeAssistant, url: str) -> None:
    """Add or update the card as a dashboard resource (storage mode only)."""
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")
    if resources is None or not hasattr(resources, "async_create_item"):
        _LOGGER.debug("Dashboard resources are not storage-managed; relying on extra module")
        return
    if not getattr(resources, "loaded", True):
        await resources.async_load()
    for item in resources.async_items():
        if str(item.get("url", "")).startswith(FRONTEND_URL):
            if item["url"] != url:
                await resources.async_update_item(item["id"], {"url": url})
            return
    await resources.async_create_item({"res_type": "module", "url": url})
