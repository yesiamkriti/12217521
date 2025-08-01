provider "google" {
  project = "top-footing-897516-n4o"
  region  = "us-central1"
}

resource "google_artifact_registry_repository" "docker_repo" {
  name       = "my-repo"
  format     = "DOCKER"
  location   = "us-central1"
  repository_id = "my-repo"
}

resource "google_cloud_run_service" "backend" {
  name     = "backend-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/top-footing-897516-n40/my-repo/backend:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
