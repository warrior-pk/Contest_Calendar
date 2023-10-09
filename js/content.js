var styleElement = document.createElement("style");
styleElement.id = "remove-scroll-style";
styleElement.textContent =
  "html::-webkit-scrollbar{display:none !important}" +
  "body::-webkit-scrollbar{display:none !important}";
document.getElementsByTagName("body")[0].appendChild(styleElement);
async function getContests() {
  try {
    const response = await fetch("https://kontests.net/api/v1/all");
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

function formatDateTime(dateTime) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date(dateTime).toLocaleDateString("en-US", options);
}
function insertData(data) {
  const currentTime = new Date();

  data.sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return dateA - dateB;
  });

  const contestList = document.getElementById("contestList");

  if (!contestList) {
    console.error("Contest List element not found.");
    return;
  }

  data.forEach((contest) => {
    const contestStartTime = new Date(contest.start_time);

    if (contestStartTime > currentTime) {
      const card = document.createElement("div");
      card.classList.add("card");
      // card.classList.add("fade-in");
      // if (contest.in_24_hours === "Yes") {
      card.classList.add("one-day");
      // }

      const content = document.createElement("div");
      content.classList.add("content");

      const details = document.createElement("div");
      details.classList.add("details");

      const nameDiv = document.createElement("div");
      const nameLink = document.createElement("a");
      nameLink.textContent = contest.name;
      nameLink.href = contest.url;
      nameLink.target = "_blank";
      nameDiv.appendChild(nameLink);
      const nameHeader = document.createElement("h3");
      nameHeader.appendChild(nameDiv);

      const description = document.createElement("div");
      description.classList.add("description");

      const timeDiv = document.createElement("div");
      const formattedTime = formatDateTime(contest.start_time);
      timeDiv.textContent = `Start Time: ${formattedTime}`;
      const timeElement = document.createElement("div");
      timeElement.classList.add("time");
      timeElement.appendChild(timeDiv);

      description.appendChild(timeElement);
      details.appendChild(nameHeader);
      details.appendChild(description);
      content.appendChild(details);
      card.appendChild(content);

      contestList.appendChild(card);
    }
  });
  const horizontalLine = document.createElement("hr");
  contestList.appendChild(horizontalLine);
}

document.addEventListener("DOMContentLoaded", function () {
  getContests()
    .then((data) => {
      const loading = document.getElementById("loading");
      loading.style.display = "none";
      insertData(data);
    })
    .catch((err) => {
      console.error(err);
    });
});
