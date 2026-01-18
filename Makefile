# Svelte-WYSIWYG Workspace - Makefile
# Development and build commands for the svelte-wysiwyg library

# === Configuration ===
# Use cmd.exe on Windows to avoid path mangling issues with npm
ifeq ($(OS),Windows_NT)
SHELL := cmd.exe
.SHELLFLAGS := /c
endif

# Default Svelte version (5 or 4)
VER ?= 5

# Package names based on version
PKG_NAME = @keenmate/svelte-wysiwyg-v$(VER)
PKG_DIR = packages/svelte-wysiwyg-v$(VER)

.PHONY: setup dev dev4 dev5 build package create-link unlink publish publish-rc publish-all publish-all-rc publish-dry clean help

# Default target
help:
	@echo Svelte-WYSIWYG Workspace - Available Commands:
	@echo.
	@echo Development:
	@echo   setup        - Install dependencies for all workspace packages
	@echo   dev          - Start Svelte 5 dev server (docs with HMR)
	@echo   dev VER=4    - Start Svelte 4 dev server
	@echo   dev4         - Shortcut for dev VER=4
	@echo   dev5         - Shortcut for dev VER=5
	@echo   build        - Build both library versions + docs
	@echo   build VER=N  - Build specific version (4 or 5)
	@echo   package      - Package library for publishing (default: v5)
	@echo   package VER=4- Package Svelte 4 version
	@echo   create-link  - Create global npm link
	@echo   unlink       - Remove global npm link
	@echo.
	@echo Publishing:
	@echo   publish      - Publish stable version to npm (latest tag)
	@echo   publish VER=4- Publish Svelte 4 version
	@echo   publish-rc   - Publish RC/prerelease version to npm (rc tag)
	@echo   publish-all  - Publish both v4 and v5 stable versions
	@echo   publish-all-rc - Publish both v4 and v5 RC versions
	@echo   publish-dry  - Dry run publish (show what would be published)
	@echo.
	@echo Cleanup:
	@echo   clean        - Clean build artifacts

setup:
	@echo Installing workspace dependencies...
	npm install
	@echo.
	@echo Setup complete!

# Svelte 5 dev server (docs)
dev:
ifeq ($(VER),4)
	@echo Starting Svelte 4 development server...
	npm run dev -w @keenmate/svelte-wysiwyg-v4
else
	@echo Starting Svelte 5 development server (docs)...
	npm run dev -w docs
endif

# Shortcuts for specific versions
dev4:
	@echo Starting Svelte 4 development server...
	npm run dev -w @keenmate/svelte-wysiwyg-v4

dev5:
	@echo Starting Svelte 5 development server (docs)...
	npm run dev -w docs

build:
ifeq ($(VER),all)
	@echo Building all packages...
	npm run build -w @keenmate/svelte-wysiwyg-v4
	npm run build -w @keenmate/svelte-wysiwyg-v5
	npm run build -w docs
else
	@echo Building Svelte $(VER) package...
	npm run build -w $(PKG_NAME)
endif

package:
	@echo.
	@echo Cleaning previous dist folder for v$(VER)...
ifeq ($(OS),Windows_NT)
	-rd /s /q $(subst /,\,$(PKG_DIR))\dist 2>nul
else
	rm -rf $(PKG_DIR)/dist
endif
	@echo Building Svelte $(VER) library package...
	cd $(PKG_DIR) && npm run build
	@echo.
	@echo Package v$(VER) built successfully
	@echo.

create-link: package
	@echo.
	@echo Creating global npm link for $(PKG_NAME)...
	cd $(PKG_DIR) && npm link
	@echo.
	@echo Link created successfully!
	@echo To use in your project, run: npm link $(PKG_NAME)
	@echo.

unlink:
	@echo.
	@echo Removing global npm link for $(PKG_NAME)...
	cd $(PKG_DIR) && npm unlink
	@echo.
	@echo Link removed successfully!
	@echo.

# Published package name (both versions publish under the same name)
PUBLISH_NAME = @keenmate/svelte-wysiwyg

publish: package
	@echo.
	@echo Publishing $(PKG_NAME) as $(PUBLISH_NAME) to npm...
	@echo.
	cd $(PKG_DIR) && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public && npm pkg set name=$(PKG_NAME)
	@echo.
	@echo Published successfully!

publish-rc: package
	@echo.
	@echo Publishing $(PKG_NAME) as $(PUBLISH_NAME) RC version to npm...
	@echo.
	cd $(PKG_DIR) && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public --tag rc && npm pkg set name=$(PKG_NAME)
	@echo.
	@echo Published successfully with tag 'rc'!

publish-dry: package
	@echo Dry run - showing what would be published for $(PKG_NAME) as $(PUBLISH_NAME)...
	cd $(PKG_DIR) && npm pkg set name=$(PUBLISH_NAME) && npm publish --dry-run && npm pkg set name=$(PKG_NAME)

publish-all:
	@echo.
	@echo Publishing both v4 and v5 as $(PUBLISH_NAME) to npm...
	@echo.
	@echo === Building and publishing v4 (v1.x) ===
	cd packages/svelte-wysiwyg-v4 && npm run build && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public && npm pkg set name=@keenmate/svelte-wysiwyg-v4
	@echo.
	@echo === Building and publishing v5 (v2.x) ===
	cd packages/svelte-wysiwyg-v5 && npm run build && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public && npm pkg set name=@keenmate/svelte-wysiwyg-v5
	@echo.
	@echo Both versions published successfully!

publish-all-rc:
	@echo.
	@echo Publishing both v4 and v5 as $(PUBLISH_NAME) RC versions to npm...
	@echo.
	@echo === Building and publishing v4 RC (v1.x) ===
	cd packages/svelte-wysiwyg-v4 && npm run build && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public --tag rc && npm pkg set name=@keenmate/svelte-wysiwyg-v4
	@echo.
	@echo === Building and publishing v5 RC (v2.x) ===
	cd packages/svelte-wysiwyg-v5 && npm run build && npm pkg set name=$(PUBLISH_NAME) && npm publish --access public --tag rc && npm pkg set name=@keenmate/svelte-wysiwyg-v5
	@echo.
	@echo Both RC versions published successfully!

clean:
	@echo Cleaning build artifacts...
ifeq ($(OS),Windows_NT)
	-rd /s /q packages\svelte-wysiwyg-v4\dist 2>nul
	-rd /s /q packages\svelte-wysiwyg-v5\dist 2>nul
	-rd /s /q packages\svelte-wysiwyg-v4\node_modules\.vite 2>nul
	-rd /s /q packages\svelte-wysiwyg-v5\node_modules\.vite 2>nul
	-rd /s /q docs\build 2>nul
else
	rm -rf packages/svelte-wysiwyg-v4/dist packages/svelte-wysiwyg-v4/node_modules/.vite
	rm -rf packages/svelte-wysiwyg-v5/dist packages/svelte-wysiwyg-v5/node_modules/.vite
	rm -rf docs/build
endif
	@echo Cleaned build artifacts
