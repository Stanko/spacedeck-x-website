import "./trailer";
import "@videojs/html/video/player";
import "@videojs/html/icons/element/compat";
import "@videojs/html/ui/container";
import "@videojs/html/ui/poster";
import "@videojs/html/ui/buffering-indicator";
import "@videojs/html/ui/controls";
import "@videojs/html/ui/controls-backdrop";
import "@videojs/html/ui/controls-content";
import "@videojs/html/ui/controls-group";
import "@videojs/html/ui/play-button";
import "@videojs/html/ui/mute-button";
import "@videojs/html/ui/volume-popover";
import "@videojs/html/ui/volume-slider";
import "@videojs/html/ui/time-group";
import "@videojs/html/ui/time";
import "@videojs/html/ui/time-separator";
import "@videojs/html/ui/time-slider";
import "@videojs/html/ui/slider-track";
import "@videojs/html/ui/slider-buffer";
import "@videojs/html/ui/slider-fill";
import "@videojs/html/ui/slider-thumb";
import "@videojs/html/ui/menu";
import "@videojs/html/ui/menu-content";
import "@videojs/html/ui/menu-radio-item";
import "@videojs/html/ui/menu-item-indicator";
import "@videojs/html/ui/quality-radio-group";
import "@videojs/html/ui/fullscreen-button";
import "@videojs/html/ui/hotkey";
import "@videojs/html/ui/gesture";
import "@videojs/html/ui/status-announcer";
import "@videojs/html/ui/error-dialog";
import "@videojs/html/ui/dialog-popup";
import "@videojs/html/ui/dialog-title";
import "@videojs/html/ui/dialog-description";
import "@videojs/html/ui/dialog-close";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: "#screenshots",
  children: ".image",
  pswpModule: PhotoSwipe,
});
lightbox.init();

// ----- NEWSLETTER ----- //

const form = document.querySelector(".subscribe-form") as HTMLFormElement;
const emailInput = form.querySelector("input[type=email]") as HTMLInputElement;
const successMessage = document.querySelector(
  ".success-message",
) as HTMLDivElement;
const errorMessage = document.querySelector(".error-message") as HTMLDivElement;
const submitButton = form.querySelector("button") as HTMLButtonElement;

const API = "https://sdx-api.muffinman.io/newsletter";
// "http://localhost:4000/newsletter";

const isValidEmailAddress = (email: string): boolean => {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRegex.test(email);
};

let loading = false;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!isValidEmailAddress(email)) {
    return;
  }

  if (loading) {
    return;
  }

  loading = true;
  errorMessage.classList.add("hidden");
  successMessage.classList.add("hidden");
  submitButton.innerText = "Loading";

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        successMessage.classList.remove("hidden");
        form.classList.add("hidden");
      } else {
        const error = data.error || "Something went wrong, please try again";
        errorMessage.textContent = error;
        errorMessage.classList.remove("hidden");
      }
    })
    .catch((error) => {
      const errorText =
        error instanceof Error
          ? error.message
          : "Something went wrong, please try again";
      errorMessage.textContent = errorText;
      errorMessage.classList.remove("hidden");
      console.error(error);
    })
    .finally(() => {
      loading = false;
      submitButton.innerText = "Subscribe";
    });
});
