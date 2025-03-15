terraform {
  backend "azurerm" {
    resource_group_name  = "sharphorizons-terraform-rg"
    storage_account_name = "tfstate077"
    container_name      = "terraform-state"
    key                 = "terraform.tfstate"
  }
}