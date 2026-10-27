"""Integration setup and websocket tests."""

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.nap_monitor.const import DOMAIN, FRONTEND_URL


async def test_setup_serves_card_and_reports_version(hass, hass_ws_client):
    entry = MockConfigEntry(domain=DOMAIN, title="Home", data={"name": "Home"}, unique_id=DOMAIN)
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # The card bundle is registered as an extra module for every dashboard...
    extra = hass.data["frontend_extra_module_url"].urls
    assert any(url.startswith(FRONTEND_URL) for url in extra)
    # ...and as a dashboard resource, so a cached app shell still picks it up.
    resources = hass.data["lovelace"].resources
    urls = [item["url"] for item in resources.async_items()]
    assert urls == [f"{FRONTEND_URL}?v=0.1.1"]
    # Setting up again updates the existing entry instead of adding a second one.
    await resources.async_update_item(
        resources.async_items()[0]["id"], {"url": f"{FRONTEND_URL}?v=0.0.9"}
    )
    hass.data.pop("nap_monitor_frontend_registered")
    from custom_components.nap_monitor import _async_register_frontend

    await _async_register_frontend(hass)
    assert [item["url"] for item in resources.async_items()] == [f"{FRONTEND_URL}?v=0.1.1"]

    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": f"{DOMAIN}/config"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["version"] == "0.1.1"
    assert msg["result"]["households"] == [{"entry_id": entry.entry_id, "name": "Home"}]


async def test_unload(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Home", data={"name": "Home"}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert entry.entry_id not in hass.data[DOMAIN]
