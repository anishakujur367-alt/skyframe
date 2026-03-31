
// const fetchData = async () => {
//   try {
//     const res = await fetch("https://api.nasa.gov/planetary/apod?api_key=Wm0kCw3Egwl1NNwiGzIir5BLnWMEVwwn7dJgHdpZ");
//     const data = await res.json();

//     console.log(data); // debug

//     const title = document.getElementById("title");
//     const desc = document.getElementById("desc");
//     const img = document.getElementById("image");

//     title.innerText = data.title;
//     desc.innerText = data.explanation;

//     if (data.media_type === "image") {
//       img.src = data.url;
//     } else {
//       img.style.display = "none";
//     }

//   } catch (error) {
//     console.log("Error:", error);
//   }
// };

// document.addEventListener("DOMContentLoaded", fetchData);




const fetchData = async () => {
  try {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=Wm0kCw3Egwl1NNwiGzIir5BLnWMEVwwn7dJgHdpZ&start_date=2025-01-01&end_date=2025-01-30"
    );

    const data = await res.json();
    console.log(data); 

    const container = document.getElementById("container");

    
    container.innerHTML = "";

   
    data.map(item => {

      const card = document.createElement("div");

      const title = document.createElement("h3");
      title.innerText = item.title;

      const img = document.createElement("img");

      if (item.media_type === "image") {
        img.src = item.url;
        img.style.width = "300px";
      }

      const desc = document.createElement("p");
      desc.innerText = item.explanation;

     
      card.appendChild(title);
      card.appendChild(img);
      card.appendChild(desc);

      container.appendChild(card);
    });

  } catch (error) {
    console.log("Error:", error);
  }
};


fetchData();