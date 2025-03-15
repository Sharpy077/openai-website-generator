terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "dns_rg" {
  name     = "sharphorizons-dns-rg"
  location = var.azure_location

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "azurerm_dns_zone" "main" {
  name                = "sharphorizons.tech"
  resource_group_name = azurerm_resource_group.dns_rg.name

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# A record for the main domain
resource "azurerm_dns_a_record" "main" {
  name                = "@"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.dns_rg.name
  ttl                 = 300
  records            = [var.server_ip]
}

# Wildcard A record for subdomains
resource "azurerm_dns_a_record" "wildcard" {
  name                = "*"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.dns_rg.name
  ttl                 = 300
  records            = [var.server_ip]
}

# CNAME record for www
resource "azurerm_dns_cname_record" "www" {
  name                = "www"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.dns_rg.name
  ttl                = 300
  record             = "sharphorizons.tech"
}