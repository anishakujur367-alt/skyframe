
const container = document.getElementById("container");
const loading = document.getElementById("loading");

const searchInput = document.getElementById("search");

const sortDropdown = document.getElementById("sortDropdown");

const toggleBtn = document.getElementById("toggleTheme");

const datePicker = document.getElementById("datePicker");
const backBtn = document.getElementById("backBtn");
const backdrop = document.getElementById("backdrop");

const loadMoreBtn = document.getElementById("loadMore");

let apodData = [];
let currentIndex = 0;
const itemsPerLoad = 20;
let displayIndex = 0;
let isViewingSingleDate = false;
let currentlyExpandedBtn = null;

// Backdrop close listener
backdrop.addEventListener("click", () => {
  if (currentlyExpandedBtn) currentlyExpandedBtn.click();
});

// 🚪 Exit Single Date View helper
const exitSingleDateMode = () => {
  isViewingSingleDate = false;
  backBtn.style.display = "none";
  loadMoreBtn.style.display = "inline-block";
};

// 🚀 Fetch Data (last 60 days)
const fetchData = async () => {
  try {
    loading.innerText = "Loading...";

    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 60);

    const end = today.toISOString().split("T")[0];
    const start = past.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=Wm0kCw3Egwl1NNwiGzIir5BLnWMEVwwn7dJgHdpZ&start_date=${start}&end_date=${end}`
    );

    const data = await res.json();
    apodData = data;

    renderData(apodData, false);
    loading.style.display = "none";

  } catch (error) {
    loading.innerText = "Error loading data";
  }
};

// 📅 Fetch Single Date
datePicker.addEventListener('change', async () => {
  const date = datePicker.value;

  if (!date) {
    alert("Please select a date");
    return;
  }

  console.log("Selected date:", date);
  loading.style.display = "block";
  loading.innerText = "Loading...";

  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=Wm0kCw3Egwl1NNwiGzIir5BLnWMEVwwn7dJgHdpZ&date=${date}`
    );

    const data = await res.json();
    console.log("API Response:", data);

    loading.style.display = "none";

    // Handle NASA API errors (e.g., future dates)
    if (data.code || !data.title) {
      container.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">No data found: ${data.msg || "Invalid response"}</p>`;

      // We still want to show the back button so the user can return!
      isViewingSingleDate = true;
      backBtn.style.display = "inline-block";
      loadMoreBtn.style.display = "none";
      return;
    }

    isViewingSingleDate = true;
    backBtn.style.display = "inline-block";
    loadMoreBtn.style.display = "none";
    renderData([data], false, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    loading.style.display = "none";
    container.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">Error fetching data</p>`;
    console.error("Fetch Error:", error);
  }
});

backBtn.onclick = () => {
  exitSingleDateMode();
  renderData(apodData, false, false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 🎨 Render (with error handling)
const renderData = (data, append = false, isSingleDate = false) => {
  if (currentlyExpandedBtn) currentlyExpandedBtn.click(); // Safety cleanup

  if (!append) {
    container.innerHTML = "";
    currentIndex = 0;
  }

  if (isSingleDate) {
    container.classList.add('single-date-view');
  } else {
    container.classList.remove('single-date-view');
  }

  const slice = data.slice(currentIndex, currentIndex + itemsPerLoad);

  slice.forEach(item => {
    if (!item.url) return; // skip missing data
    if (!isSingleDate && item.media_type === "video") return; // skip videos in normal view

    const card = document.createElement("div");
    card.style.margin = "20px";

    const title = document.createElement("h3");
    title.innerText = item.title;

    let media;

    // 📸 Image
    if (item.media_type === "image") {
      media = document.createElement("img");
      media.src = item.url;
      media.style.width = "300px";

      // ❌ Skip if image fails
      media.onerror = () => {
        card.remove();
      };
    }

    // 🎥 Video
    else {
      if (isSingleDate) {
        media = document.createElement("p");
        media.innerText = "🚫 Image not available for this date";
        media.style.color = "red";
        media.style.fontWeight = "bold";
        media.style.padding = "20px 0";
      } else {
        return; // fallback safeguard
      }
    }

    const desc = document.createElement("p");
    desc.innerText = item.explanation.substring(0, 100) + "...";

    // 📖 View More
    const viewBtn = document.createElement("button");
    viewBtn.innerText = "View More";

    let expanded = false;
    viewBtn.onclick = () => {
      expanded = !expanded;
      if (expanded) {
        if (currentlyExpandedBtn && currentlyExpandedBtn !== viewBtn) {
          currentlyExpandedBtn.click(); // close the old one
        }
        currentlyExpandedBtn = viewBtn;

        card.classList.add("expanded-card");
        backdrop.classList.add("active");
        desc.innerText = item.explanation;
        viewBtn.innerText = "Close View";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      } else {
        currentlyExpandedBtn = null;
        card.classList.remove("expanded-card");
        backdrop.classList.remove("active");
        desc.innerText = item.explanation.substring(0, 100) + "...";
        viewBtn.innerText = "View More";
        document.body.style.overflow = "auto";
      }
    };

    // ❤️ Like
    const likeBtn = document.createElement("button");
    likeBtn.innerText = "🤍 Like";

    let liked = false;
    likeBtn.onclick = () => {
      liked = !liked;
      likeBtn.innerText = liked ? "❤️ Liked" : "🤍 Like";
    };

    // ⭐ Favorite
    const favBtn = document.createElement("button");
    favBtn.innerText = "⭐ Favorite";

    let fav = false;
    favBtn.onclick = () => {
      fav = !fav;
      favBtn.innerText = fav ? "🌟 Favorited" : "⭐ Favorite";
    };

    card.append(title, media, desc, viewBtn, likeBtn, favBtn);
    container.appendChild(card);
  });

  currentIndex += itemsPerLoad;
};

// 🔽 Load More
loadMoreBtn.onclick = () => {
  renderData(apodData, true);
};

// 🔍 Search
searchInput.addEventListener("input", () => {
  exitSingleDateMode();
  const query = searchInput.value.toLowerCase();
  const filtered = apodData.filter(item =>
    item.title.toLowerCase().includes(query)
  );
  renderData(filtered, false);
});


// 📊 Sort
sortDropdown.addEventListener("change", (e) => {
  exitSingleDateMode();
  if (e.target.value === "az") {
    renderData([...apodData].sort((a, b) => a.title.localeCompare(b.title)), false);
  } else if (e.target.value === "za") {
    renderData([...apodData].sort((a, b) => b.title.localeCompare(a.title)), false);
  }
});

// 🌙 Dark Mode State Management
// Determine initial state based on storage, default is dark (black)
if (localStorage.getItem("theme") === "light") {
  document.body.style.backgroundColor = "white";
  document.body.style.color = "black";
  toggleBtn.innerText = "🌙";
} else {
  document.body.style.backgroundColor = "black";
  document.body.style.color = "white";
  toggleBtn.innerText = "☀️";
}

toggleBtn.onclick = () => {
  if (document.body.style.backgroundColor === "black") {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    localStorage.setItem("theme", "light");
    toggleBtn.innerText = "🌙";
  } else {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    localStorage.setItem("theme", "dark");
    toggleBtn.innerText = "☀️";
  }
};



// 🔄 Auto UI Rotation (10 min)
setInterval(() => {
  if (apodData.length === 0) return;
  if (isViewingSingleDate) return;

  const next = apodData.slice(displayIndex, displayIndex + 16);
  renderData(next, false);

  displayIndex += 16;
  if (displayIndex >= apodData.length) displayIndex = 0;

}, 30000); 

// 🚀 Start
fetchData();