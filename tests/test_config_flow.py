"""Config flow tests."""

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.nap_monitor.const import DOMAIN


async def test_user_flow_creates_household(hass):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={"name": "Maple House"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Maple House"
    assert result["data"] == {"name": "Maple House"}


async def test_single_instance(hass):
    MockConfigEntry(
        domain=DOMAIN, title="Home", data={"name": "Home"}, unique_id=DOMAIN
    ).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT
