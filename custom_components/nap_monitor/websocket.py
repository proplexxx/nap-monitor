"""Websocket API for the Nap Monitor card."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.loader import async_get_integration

from .const import DOMAIN


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    websocket_api.async_register_command(hass, ws_get_config)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/config"})
@websocket_api.async_response
async def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the integration version and configured households.

    The card uses this to detect that the integration is installed. The
    household model (children, locations, cameras) is added in phase 1.
    """
    integration = await async_get_integration(hass, DOMAIN)
    households = [
        {"entry_id": entry.entry_id, "name": entry.title}
        for entry in hass.config_entries.async_entries(DOMAIN)
    ]
    connection.send_result(
        msg["id"],
        {"version": integration.version, "households": households},
    )
