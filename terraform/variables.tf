variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "diet-me"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "docdb_username" {
  description = "Username for DocumentDB cluster"
  type        = string
  default     = "dbadmin"
}

variable "docdb_password" {
  description = "Password for DocumentDB cluster"
  type        = string
  sensitive   = true
}

variable "docdb_instance_count" {
  description = "Number of DocumentDB instances"
  type        = number
  default     = 1
}

variable "docdb_instance_class" {
  description = "Instance class for DocumentDB"
  type        = string
  default     = "db.t3.medium"
}

variable "github_repo" {
  description = "GitHub repository name in format: organization/repository"
  type        = string
} 