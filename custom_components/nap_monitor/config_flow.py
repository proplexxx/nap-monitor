"""Config flow for Nap Monitor.

Phase 0 creates a single "household" entry. Children, locations and cameras
arrive as config sub-entries in phase 1.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import CONF_NAME, DEFAULT_NAME, DOMAIN

STEP_USER_SCHEMA = vol.Schema({vol.Required(CONF_NAME, default=DEFAULT_NAME): str})


class NapMonitorConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the household entry."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Ask for a household name and create the entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title=user_input[CONF_NAME], data=user_input)

        return self.async_show_form(step_id="user", data_schema=STEP_USER_SCHEMA)
