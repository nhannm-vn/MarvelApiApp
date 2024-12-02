const ts = "1728548288200";
const publicKey = "91232379fa191da715faf7cc2aae1737";
const hashVal = "08b0823c430604e5de76c107eae3fca9";

// tạo class tạo ra instance gửi request
class Http {
  get(url) {
    return fetch(url).then((response) => {
      //kiểm tra trạng thái gói hàng
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }
}
console.log("hello");

//dom tới các ô bên kia
const input = document.querySelector("#input-box");
const button = document.querySelector("#submit-button");
const showContainer = document.querySelector("#show-container");
const listContainer = document.querySelector(".list");

const baseURL = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashVal}&name=`;

//class Store: chuyên lưu trữ dữ liẹu
class Store {
  constructor() {
    this.http = new Http();
  }
  getCharacter(name) {
    let tmp = `${baseURL}` + `${name}`;
    return this.http.get(tmp);
  }

  // //lấy dữ liệu dựa vào key
  // getItemByKey(key) {
  //     let tmp = `${baseURL}` + `${key}`;
  //     return this.http.get(tmp);
  // };
}

//class RenderUI: chuyên hiển thị dữ liệu lên ui
class RenderUI {
  renderCharacter(character) {
    const data = character.data["results"];
    let urlImg = "";
    urlImg = data[0].thumbnail["path"] + "." + data[0].thumbnail["extension"];
    let htmlContent = `
            <div class="character">
                <div class="character-img">
                    <img src="${urlImg}" alt="Hình lỗi gòi">
                </div>
                <h1>${data[0].name}</h1>
                <p>
                    ${data[0].description}
                </p>
            </div>`;
    //nhét vào ui
    showContainer.innerHTML = htmlContent;
  }

  // //hàm search tới đâu thì hiển thị list tới đó
  // renderList(item) {
  //     //tạo ra dom ảo
  //     let div = document.createElement("div");
  //     //thêm khả năng click cho nó
  //     div.style.cursor = "pointer";
  // }
}

//sự kiện submit thì hiển thị
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  //lấy dữ liệu từ ô input
  let name = input.value.trim();
  //tạo ra instance
  let ui = new RenderUI();
  let store = new Store();

  store.getCharacter(name).then((character) => {
    ui.renderCharacter(character);
  });
});

function displayWords(value) {
  input.value = value;
  removeElement();
}

function removeElement(params) {
  listContainer.innerHTML = "";
}

//sự kiện nhấn thì tìm ra
input.addEventListener("input", (event) => {
  //xóa đi dữ liệu cũ
  listContainer.innerHTML = "";

  //lấy dữ liệu
  const baseURL2 = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashVal}&nameStartsWith=${input.value}`;

  //lấy dữ liệu
  let http = new Http();
  http.get(baseURL2).then((jsonData) => {
    //hiển thị lại cái list đi
    listContainer.style.display = "block";
    jsonData.data["results"].forEach((result) => {
      //lấy ra name
      let name = result.name;
      //tạo ra dom ảo
      let div = document.createElement("div");
      //thêm khả năng click cho nó
      div.style.cursor = "pointer";
      div.classList.add("autocomplete-items");
      //gõ tới đâu thì đậm tới đó
      div.setAttribute("onclick", "displayWords('" + name + "')");
      let word = "<b>" + name.substring(0, input.value.length) + "</b>";
      //ghép với phần name còn lại
      word += name.substring(input.value.length);
      //nhét word vào list nhưng mà word phải bỏ trong thẻ p
      div.innerHTML = `<p style="margin: 0;" class="item">${word}</p>`;
      //nhét div vào list
      listContainer.appendChild(div);
    });
    //xử lí thay đổi display div list
    listContainer.addEventListener("click", (event) => {
      //hiển thị lại cái list đi
      listContainer.style.display = "none";
    });
  });
});
