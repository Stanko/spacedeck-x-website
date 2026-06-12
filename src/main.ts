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

const API = "http://localhost:4000/newsletter";
// "https://sdx-api.muffinman.io/newsletter";

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
