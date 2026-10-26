"""Constants for the Nap Monitor integration."""

from __future__ import annotations

DOMAIN = "nap_monitor"

FRONTEND_DIR = "frontend"
FRONTEND_FILENAME = "nap-monitor-card.js"
FRONTEND_URL_BASE = f"/{DOMAIN}"
FRONTEND_URL = f"{FRONTEND_URL_BASE}/{FRONTEND_FILENAME}"

DATA_FRONTEND_REGISTERED = f"{DOMAIN}_frontend_registered"

CONF_NAME = "name"
DEFAULT_NAME = "Home"
