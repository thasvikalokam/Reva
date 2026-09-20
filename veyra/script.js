/* =========================================================
   REVA JAVASCRIPT
   ========================================================= */


/* =========================================================
   SAMPLE ITEMS
   ========================================================= */

const defaultItems = [

    {
        id: 1,
        name: "Engineering Books",
        category: "books",
        type: "Donate",
        location: "1.2 km away",
        description: "Useful engineering textbooks in good condition.",
        icon: "📚",
        owner: "Aarav"
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "electronics",
        type: "Exchange",
        location: "0.8 km away",
        description: "Working wireless headphones available for exchange.",
        icon: "🎧",
        owner: "Meera"
    },

    {
        id: 3,
        name: "Plant Pot Set",
        category: "plants",
        type: "Donate",
        location: "2.4 km away",
        description: "Three reusable plant pots looking for a new home.",
        icon: "🪴",
        owner: "Rohan"
    },

    {
        id: 4,
        name: "Study Table",
        category: "furniture",
        type: "Exchange",
        location: "1.7 km away",
        description: "Wooden study table in good condition.",
        icon: "🪑",
        owner: "Ananya"
    },

    {
        id: 5,
        name: "Programming Books",
        category: "books",
        type: "Borrow",
        location: "1.5 km away",
        description: "Java and Python books available for borrowing.",
        icon: "📖",
        owner: "Kiran"
    },

    {
        id: 6,
        name: "College Backpack",
        category: "clothing",
        type: "Donate",
        location: "2.1 km away",
        description: "Clean and lightly used college backpack.",
        icon: "🎒",
        owner: "Sneha"
    },

    {
        id: 7,
        name: "Desk Lamp",
        category: "electronics",
        type: "Donate",
        location: "1.9 km away",
        description: "LED desk lamp with adjustable brightness.",
        icon: "💡",
        owner: "Vikram"
    },

    {
        id: 8,
        name: "Indoor Plant",
        category: "plants",
        type: "Exchange",
        location: "3.0 km away",
        description: "Healthy indoor plant available for exchange.",
        icon: "🌿",
        owner: "Priya"
    }

];


/* =========================================================
   LOAD ITEMS
   ========================================================= */

let items =
    JSON.parse(localStorage.getItem("revaItems"))
    || defaultItems;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderItems();

        updateUserUI();

        updateHeroCount();

        updateImpactCount();

    }
);


/* =========================================================
   RENDER ITEMS
   ========================================================= */

function renderItems(filteredItems = items) {

    const grid =
        document.getElementById("itemsGrid");

    const empty =
        document.getElementById("emptyState");


    grid.innerHTML = "";


    if (filteredItems.length === 0) {

        empty.classList.remove("hidden");

        return;

    }


    empty.classList.add("hidden");


    filteredItems.forEach(function (item) {

        const card =
            document.createElement("div");

        card.className = "item-card";


        let imageContent =
            `<span>${item.icon || "📦"}</span>`;


        if (item.image) {

            imageContent =
                `<img src="${item.image}"
                      alt="${item.name}">`;

        }


        card.innerHTML = `

            <div class="card-image">
                ${imageContent}
            </div>

            <div class="card-content">

                <span class="item-badge">
                    ${item.type}
                </span>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <span class="item-location">
                    📍 ${escapeHTML(item.location)}
                </span>

                <div class="card-bottom">

                    <span class="card-user">
                        Listed by ${escapeHTML(item.owner || "REVA Member")}
                    </span>

                    <button
                        class="view-button"
                        onclick="viewItem(${item.id})">

                        View

                    </button>

                </div>

            </div>
        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   SEARCH / FILTER
   ========================================================= */

function filterItems() {

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const category =
        document.getElementById("categoryFilter")
        .value;


    const type =
        document.getElementById("typeFilter")
        .value;


    const filtered =
        items.filter(function (item) {

            const matchesSearch =
                item.name.toLowerCase().includes(search)
                ||
                item.description.toLowerCase().includes(search);


            const matchesCategory =
                category === "all"
                ||
                item.category === category;


            const matchesType =
                type === "all"
                ||
                item.type === type;


            return (
                matchesSearch
                &&
                matchesCategory
                &&
                matchesType
            );

        });


    renderItems(filtered);

}


/* =========================================================
   VIEW ITEM
   ========================================================= */

function viewItem(id) {

    const item =
        items.find(function (i) {

            return i.id === id;

        });


    if (!item) {

        return;

    }


    alert(
        "Item: " + item.name +
        "\n\nType: " + item.type +
        "\nLocation: " + item.location +
        "\nOwner: " + item.owner +
        "\n\n" + item.description +
        "\n\nIn the full backend version, this button can open a chat or exchange request."
    );

}


/* =========================================================
   ADD ITEM
   ========================================================= */

function openAddItem() {

    const currentUser =
        JSON.parse(
            localStorage.getItem("revaUser")
        );


    if (!currentUser) {

        showToast(
            "Please login before listing an item."
        );

        openLogin();

        return;

    }


    document
        .getElementById("itemModal")
        .classList.remove("hidden");

}


function addItem(event) {

    event.preventDefault();


    const user =
        JSON.parse(
            localStorage.getItem("revaUser")
        );


    if (!user) {

        showToast(
            "Please login first."
        );

        return;

    }


    const name =
        document.getElementById("itemName").value;


    const category =
        document.getElementById("itemCategory").value;


    const type =
        document.getElementById("itemType").value;


    const location =
        document.getElementById("itemLocation").value;


    const description =
        document.getElementById("itemDescription").value;


    const imageInput =
        document.getElementById("itemImage");


    let image = "";


    /*
       Images selected by the user are stored as
       base64 data in localStorage for this prototype.
    */

    if (
        imageInput.files
        &&
        imageInput.files[0]
    ) {

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                image =
                    event.target.result;


                saveNewItem(
                    name,
                    category,
                    type,
                    location,
                    description,
                    image,
                    user
                );

            };


        reader.readAsDataURL(
            imageInput.files[0]
        );

    }

    else {

        saveNewItem(
            name,
            category,
            type,
            location,
            description,
            "",
            user
        );

    }

}


function saveNewItem(
    name,
    category,
    type,
    location,
    description,
    image,
    user
) {

    const newItem = {

        id: Date.now(),

        name: name,

        category: category,

        type: type,

        location: location,

        description: description,

        image: image,

        icon: getCategoryIcon(category),

        owner: user.name

    };


    items.unshift(newItem);


    localStorage.setItem(
        "revaItems",
        JSON.stringify(items)
    );


    document
        .querySelector("#itemModal form")
        .reset();


    document
        .getElementById("imagePreview")
        .classList.add("hidden");


    closeModal("itemModal");


    renderItems();


    updateHeroCount();

    updateImpactCount();


    showToast(
        "Your item has been listed on REVA!"
    );

}


/* =========================================================
   CATEGORY ICON
   ========================================================= */

function getCategoryIcon(category) {

    const icons = {

        books: "📚",

        electronics: "🎧",

        furniture: "🪑",

        clothing: "👕",

        plants: "🌱",

        others: "📦"

    };


    return icons[category] || "📦";

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function previewItemImage(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            document
                .getElementById("previewImage")
                .src = e.target.result;


            document
                .getElementById("imagePreview")
                .classList.remove("hidden");

        };


    reader.readAsDataURL(file);

}


/* =========================================================
   LOGIN
   ========================================================= */

function openLogin(mode = "login") {

    document
        .getElementById("authModal")
        .classList.remove("hidden");


    if (mode === "register") {

        showRegister();

    }

    else {

        showLogin();

    }

}


function showLogin() {

    document
        .getElementById("loginForm")
        .classList.remove("hidden");


    document
        .getElementById("registerForm")
        .classList.add("hidden");


    document
        .getElementById("authTitle")
        .textContent =
        "Welcome back";


    document
        .getElementById("authSubtitle")
        .textContent =
        "Login to continue to your REVA community.";


    document
        .getElementById("authSwitchText")
        .textContent =
        "Don't have an account?";


    document
        .getElementById("authSwitchButton")
        .textContent =
        "Join REVA";

}


function showRegister() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");


    document
        .getElementById("registerForm")
        .classList.remove("hidden");


    document
        .getElementById("authTitle")
        .textContent =
        "Join REVA";


    document
        .getElementById("authSubtitle")
        .textContent =
        "Create your account and start sharing.";


    document
        .getElementById("authSwitchText")
        .textContent =
        "Already have an account?";


    document
        .getElementById("authSwitchButton")
        .textContent =
        "Login";

}


function switchAuth() {

    const register =
        !document
            .getElementById("registerForm")
            .classList.contains("hidden");


    if (register) {

        showLogin();

    }

    else {

        showRegister();

    }

}


/* =========================================================
   REGISTER
   ========================================================= */

function registerUser(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    if (
        !name
        ||
        !email
        ||
        !password
    ) {

        showToast(
            "Please complete all fields."
        );

        return;

    }


    const user = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "revaUser",
        JSON.stringify(user)
    );


    closeModal("authModal");


    updateUserUI();


    showToast(
        "Welcome to REVA, " + name + "!"
    );

}


/* =========================================================
   LOGIN
   ========================================================= */

function loginUser(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const storedUser =
        JSON.parse(
            localStorage.getItem("revaUser")
        );


    /*
       For this frontend prototype:
       If no account exists, create a simple demo session.
    */

    if (!storedUser) {

        const demoUser = {

            name: email
                .split("@")[0]
                .replace(/[^a-zA-Z]/g, " "),

            email: email,

            password: password

        };


        localStorage.setItem(
            "revaUser",
            JSON.stringify(demoUser)
        );


        closeModal("authModal");

        updateUserUI();

        showToast(
            "Logged in successfully!"
        );

        return;

    }


    if (
        email !== storedUser.email
        ||
        password !== storedUser.password
    ) {

        showToast(
            "Email or password is incorrect."
        );

        return;

    }


    closeModal("authModal");

    updateUserUI();


    showToast(
        "Welcome back, " +
        storedUser.name +
        "!"
    );

}


/* =========================================================
   PROFILE
   ========================================================= */

function openProfile() {

    const user =
        JSON.parse(
            localStorage.getItem("revaUser")
        );


    if (!user) {

        openLogin();

        return;

    }


    document
        .getElementById("profileModal")
        .classList.remove("hidden");


    document
        .getElementById("profileName")
        .textContent =
        user.name;


    document
        .getElementById("profileEmail")
        .textContent =
        user.email;


    const initial =
        user.name
            .charAt(0)
            .toUpperCase();


    document
        .getElementById("profileAvatar")
        .textContent =
        initial;


    const myItems =
        items.filter(function (item) {

            return item.owner === user.name;

        });


    document
        .getElementById("myListingsCount")
        .textContent =
        myItems.length;


    const list =
        document
            .getElementById("profileListings");


    list.innerHTML = "";


    if (myItems.length === 0) {

        list.innerHTML = `
            <div class="profile-listing">
                You haven't listed anything yet.
            </div>
        `;

        return;

    }


    myItems.forEach(function (item) {

        const element =
            document.createElement("div");


        element.className =
            "profile-listing";


        element.innerHTML = `
            <span>
                ${escapeHTML(item.name)}
            </span>

            <strong>
                ${escapeHTML(item.type)}
            </strong>
        `;


        list.appendChild(element);

    });

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    localStorage.removeItem(
        "revaUser"
    );


    closeModal("profileModal");


    updateUserUI();


    showToast(
        "You have been logged out."
    );

}


/* =========================================================
   USER UI
   ========================================================= */

function updateUserUI() {

    const user =
        JSON.parse(
            localStorage.getItem("revaUser")
        );


    const loginButton =
        document.querySelector(
            ".login-button"
        );


    const joinButton =
        document.querySelector(
            ".join-button"
        );


    const profileButton =
        document.querySelector(
            ".profile-button"
        );


    if (user) {

        loginButton.classList.add(
            "hidden"
        );


        joinButton.classList.add(
            "hidden"
        );


        profileButton.classList.remove(
            "hidden"
        );


        document
            .getElementById("navUserInitial")
            .textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    }

    else {

        loginButton.classList.remove(
            "hidden"
        );


        joinButton.classList.remove(
            "hidden"
        );


        profileButton.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   HERO COUNT
   ========================================================= */

function updateHeroCount() {

    const count =
        items.length;


    const element =
        document
            .getElementById("heroItemsCount");


    if (element) {

        element.textContent =
            (2400 + count) + "+";

    }

}


/* =========================================================
   IMPACT COUNT
   ========================================================= */

function updateImpactCount() {

    const element =
        document
            .getElementById("impactItems");


    if (element) {

        element.textContent =
            (1860 + items.length)
            + " items";

    }

}


/* =========================================================
   MODAL
   ========================================================= */

function closeModal(id) {

    document
        .getElementById(id)
        .classList.add("hidden");

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMobileMenu() {

    const menu =
        document
            .getElementById("mobileMenu");


    if (
        menu.style.display === "block"
    ) {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


function closeMobileMenu() {

    document
        .getElementById("mobileMenu")
        .style.display = "none";

}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document
            .getElementById("toast");


    document
        .getElementById("toastMessage")
        .textContent =
        message;


    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            event.target.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   NAVIGATION ACTIVE STATE
   ========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener(
    "scroll",
    function () {

        let current = "";


        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 120;


            if (
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        document
            .querySelectorAll(".nav-link")
            .forEach(function (link) {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute("href")
                    ===
                    "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            });

    }
);