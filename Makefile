.PHONY: help install run build test lint csv

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	yarn install

run: ## Start development server on port 9009
	yarn dev

build: ## Build for production
	yarn build

test: ## Run tests
	yarn test

lint: ## Lint and fix files
	yarn lint

csv: ## Generate JSON from CSV data files
	yarn csv
