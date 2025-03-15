variable "server_ip" {
  description = "The IP address of the server hosting the website"
  type        = string
}

variable "environment" {
  description = "The environment (e.g., prod, dev, staging)"
  type        = string
  default     = "prod"
}

variable "azure_location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "australiaeast"
}

variable "project" {
  description = "The name of the project"
  type        = string
  default     = "SharpHorizons"
}