#!/bin/bash
cd "$(dirname "$0")"
exec rake delay:get
