document.addEventListener("DOMContentLoaded", function () {
    const dotCount = 200;
    const backgroundDots = document.querySelector(".background-dots");
    const planetContainer = document.querySelector(".planet-container");
    const navLinks = document.querySelector(".nav-links");
    const infoContainer = document.querySelector(".info");
    const infoTitle = document.querySelector(".info h1");
    const infoParagraph = document.querySelector(".info p");
    const wikiLink = document.querySelector(".wiki-link");
    const digitalSection = document.querySelector(".digital");
    const listInfo = document.querySelector(".list-info");
    const logo = document.querySelector(".logo a");
    const mobileNav = document.querySelector(".mobile-nav");
    const menuToggle = document.getElementById("menu-toggle");
    const mainElement = document.querySelector("main"); // Отримання елемента main

    // Створення фонових точок
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("div");
        const size = Math.random() * 3;
        const isOval = Math.random() > 0.5;

        dot.classList.add("dot");
        dot.style.width = `${size}px`;
        dot.style.height = isOval ? `${size * 1.5}px` : `${size}px`;
        dot.style.position = "absolute";
        dot.style.top = `${Math.random() * 100}vh`;
        dot.style.left = `${Math.random() * 100}vw`;
        dot.style.backgroundColor = "#6F6F6F";
        dot.style.borderRadius = "50%";
        dot.style.animation = "generateDots 0.5s ease-in-out";

        backgroundDots.appendChild(dot);
    }

    // Отримання даних з JSON
    fetch("./planets.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((planets) => {
            const allNavLinks = document.querySelectorAll(".nav-links"); // Отримуємо всі елементи з класом .nav-links

            allNavLinks.forEach((navElement) => {
                navElement.innerHTML = "";
                planets.forEach((planet) => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = `#${planet.planet.toLowerCase()}`;
                    a.textContent =
                        planet.planet.charAt(0).toUpperCase() + planet.planet.slice(1);
                    a.addEventListener("click", () => {
                        updatePlanetInfo(planet);
                    });
                    li.appendChild(a);
                    navElement.appendChild(li);

                    // Додаємо обробники подій для hover (залишаємо, але стилі будуть іншими)
                    li.addEventListener("mouseover", () => {
                        const a = li.querySelector("a");
                        if (navElement.closest('.mobile-nav')) {
                            a.style.color = "#fff"; // Змінюємо колір тексту при наведенні в мобільному меню
                        } else {
                            li.style.borderTop = `4px solid ${planet["button-color"]}`;
                            a.style.color = "#fff";
                        }
                    });
                    li.addEventListener("mouseout", () => {
                        const a = li.querySelector("a");
                        if (navElement.closest('.mobile-nav')) {
                            a.style.color = ""; // Повертаємо колір тексту
                        } else {
                            li.style.borderTop = "none";
                            a.style.color = "";
                        }
                    });
                });
            });

            // Додаємо класи для стилізації мобільного меню після створення посилань
            const mobileNavUL = document.querySelector(".mobile-nav .nav-links");
            if (mobileNavUL) {
                mobileNavUL.classList.add("mobile-nav-list");
                mobileNavUL.querySelectorAll('li > a').forEach(link => {
                    const color = planets.find(p => p.planet.toLowerCase() === link.textContent.toLowerCase())?.["button-color"];
                    if (color) {
                        link.style.setProperty('--marker-color', color);
                    }
                    const arrowImg = document.createElement('img');
                    arrowImg.src = './assets/img/arrayNav.svg';
                    arrowImg.alt = 'Arrow';
                    arrowImg.style.width = '4px';
                    arrowImg.style.height = '8px';
                    arrowImg.style.marginLeft = 'auto'; // Притискаємо стрілку вправо
                    link.appendChild(arrowImg);
                });
            }

            // Відображення сонячної системи на початку
            displaySolarSystem(planets);

            // Обробник кліку на логотип
            logo.addEventListener("click", (event) => {
                event.preventDefault();
                displaySolarSystem(planets);
            });

            // Обробник кліку на бургер-меню
            menuToggle.addEventListener("change", function () {
                if (menuToggle.checked) {
                    mobileNav.style.display = "flex";
                    mainElement.style.display = "none"; // Приховати main
                } else {
                    mobileNav.style.display = "none";
                    mainElement.style.display = "grid"; // показати main
                }
            });

            // Додаємо обробник кліків для мобільного меню
            if (mobileNav) {
                const mobileNavLinks = mobileNav.querySelectorAll('.nav-links a');
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        mobileNav.style.display = 'none';
                        menuToggle.checked = false;
                        mainElement.style.display = "grid"; // показати main
                    });
                });
            }

            function displaySolarSystem(planets) {
                // Очищаємо planetContainer
                planetContainer.innerHTML = "";
                planetContainer.className = "planet-container flex solar-system-container";

                // Створення сонця
                const sun = document.createElement("div");
                sun.className = "sun";
                const sunImg = document.createElement("img");
                sunImg.src = planets[0]["overview-img"];
                sunImg.alt = "Sun";

                // Створення елементу для назви Сонця
                const sunName = document.createElement("div");
                sunName.className = "planet-name";
                sunName.textContent = "Sun";
                sun.appendChild(sunName);

                sun.appendChild(sunImg); // Додаємо зображення до sun
                planetContainer.appendChild(sun);

                // Стилі для сонця + клік
                sun.style.position = "absolute";
                sun.style.top = "50%";
                sun.style.left = "50%";
                sun.style.transform = "translate(-50%, -50%)";
                sunImg.style.width = "150px";
                sunImg.style.height = "150px";
                sun.style.cursor = "pointer";
                sunImg.addEventListener("click", () => {
                    updatePlanetInfo(planets[0]);
                });

                // Створення орбіт та планет
                for (let i = planets.length - 1; i > 0; i--) {
                    let planetData = planets[i];

                    // Обчислюємо розмір орбіти
                    const orbitRadius = i === 1 ? 200 : 200 + (i - 1) * 50;
                    const orbit = document.createElement("div");
                    orbit.className = "orbit";
                    orbit.style.width = `${orbitRadius}px`;
                    orbit.style.height = `${orbitRadius}px`;
                    orbit.style.pointerEvents = "auto";
                    planetContainer.appendChild(orbit);

                    const planet = document.createElement("div");
                    planet.className = "planet";
                    const planetImg = document.createElement("img");
                    planetImg.src = planetData["overview-img"];
                    planetImg.alt = planetData.planet;

                    // Створення елементу для назви планети
                    const planetName = document.createElement("span");
                    planetName.className = "planet-name";
                    planetName.textContent =
                        planetData.planet.charAt(0).toUpperCase() + planetData.planet.slice(1);
                    // Додаємо назву до planet

                    planet.appendChild(planetImg); // Додаємо зображення до planet
                    orbit.appendChild(planet);
                    planet.appendChild(planetName);

                    // Розміщення планети на орбіті + клік
                    planet.style.position = "absolute";
                    planet.style.transform = `translate(${orbitRadius / 2 - 12.5}px)`;
                    planetImg.style.width = "25px";
                    planetImg.style.cursor = "pointer";
                    sun.style.zIndex = i + 1;

                    // Обробник кліку на зображення
                    planetImg.addEventListener("click", function () {
                        updatePlanetInfo(planetData);
                    });

                    // Анімація обертання (додатково)
                    orbit.style.animation = `rotate ${30 + i * 5}s linear infinite`;

                }

                // Оновлення тексту при поверненні до сонячної системи
                infoTitle.textContent = "The Solar System";
                infoParagraph.textContent =
                    "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it, either directly or indirectly. Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, such as dwarf planets and small Solar System bodies.";
                wikiLink.href = "https://en.wikipedia.org/wiki/Solar_System";

                // Оновлення цифрової інформації
                digitalSection.innerHTML = "";
                const digitalInfo = {
                    "planets": "8",
                    "dwarf planets": "5",
                    "satellites": "470",
                    "stars": "1"
                };
                for (const key in digitalInfo) {
                    const div = document.createElement("div");
                    div.className = "digital-info";
                    div.innerHTML = `<h4>${key}</h4><h2>${digitalInfo[key]}</h2>`;
                    digitalSection.appendChild(div);
                }

                // Очищаємо кнопки розділів, якщо вони є
                listInfo.innerHTML = "";
            }

            function updatePlanetInfo(planet) {
                console.log("Updating planet info:", planet);
                // Оновлення основної інформації
                planetContainer.className = `planet-container flex ${planet.planet.toLowerCase()}-container`;
                planetContainer.innerHTML = `<img src="${planet["overview-img"]}" alt="${planet.planet}">`;
                infoTitle.textContent =
                    planet.planet.charAt(0).toUpperCase() + planet.planet.slice(1);
                infoParagraph.textContent = planet.overview;
                wikiLink.href = planet["wiki-link"];

                // Створення кнопок для розділів
                listInfo.innerHTML = "";
                const sections = ["overview", "internal-structure", "surface-geology"];

                sections.forEach((section, index) => {
                    if (planet[section]) {
                        const button = document.createElement("button");
                        button.className = `info-button flex ${planet.planet.toLowerCase()}-btn`;
                        button.innerHTML = `<span class="button-number">0${
                            index + 1
                        }</span><span class="button-text">${section.replace("-", " ")}</span>`;
                        button.addEventListener("click", () => {
                            updateSection(planet, section, sections);
                        });
                        listInfo.appendChild(button);
                    }
                });

                // Активуємо кнопку Overview
                if (document.querySelector(`.${planet.planet.toLowerCase()}-btn`)) {
                    const activeButton = document.querySelector(
                        `.${planet.planet.toLowerCase()}-btn`
                    );
                    activeButton.classList.add("active");
                    activeButton.style.backgroundColor = planet["button-color"];
                }

                // Оновлення цифрової інформації (ТІЛЬКИ ТУТ)
                digitalSection.innerHTML = "";
                const digitalInfo = {
                    "rotation time": { label: "Rotation Time", unit: " days" },
                    "revolution time": { label: "Revolution Time", unit: " days" },
                    radius: { label: "Radius", unit: " km" },
                    "average temp.": { label: "Average Temp.", unit: "°C" },
                };
                Object.keys(digitalInfo).forEach((key) => {
                    if (planet[key]) {
                        const div = document.createElement("div");
                        div.className = "digital-info";
                        div.innerHTML = `<h4>${digitalInfo[key].label}</h4><h2>${
                            planet[key] || "N/A"
                        }${planet[key] ? digitalInfo[key].unit : ""}</h2>`;
                        digitalSection.appendChild(div);
                    }
                });
            }

            function updateSection(planet, section, sections) {
                console.log("Updating section:", section, "for planet:", planet);
                // Оновлення активної кнопки
                document
                    .querySelectorAll(".info-button")
                    .forEach((btn) => {
                        btn.classList.remove("active");
                        btn.style.backgroundColor = "";
                    });
                const activeButton = document.querySelector(
                    `.${planet.planet.toLowerCase()}-btn:nth-child(${
                        sections.indexOf(section) + 1
                    })`
                );
                if (activeButton) {
                    activeButton.classList.add("active");
                    activeButton.style.backgroundColor = planet["button-color"];
                }

                // Оновлення контенту
                if (planet[section + "-img"] && planet[section]) {
                    let imgSource = planet[section + "-img"];
                    if (section === "surface-geology") {
                        imgSource = planet["overview-img"];
                    }
                    planetContainer.innerHTML = `<img src="${imgSource}" alt="${
                        planet.planet
                    } ${section}">`;
                    infoParagraph.textContent = planet[section];
                    console.log("Updated container:", planetContainer.innerHTML);
                    console.log("Updated paragraph:", infoParagraph.textContent);

                    // Додаємо SVG-зображення для "Surface Geology"
                    if (section === "surface-geology" && planet["surface-geology-img"]) {
                        const svgColor = planet["geology-pointer-color"];
                        const svgDiv = document.createElement("div");
                        svgDiv.className = "geology-svg-container";
                        svgDiv.innerHTML = `
                            <svg class="geology-svg" width="163" height="199" viewBox="0 0 163 199" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M96.9879 37.4698C134.592 44.7041 163 77.7846 163 117.5C163 162.511 126.511 199 81.5 199C36.4888 199 0 162.511 0 117.5C0 77.4052 28.953 44.0728 67.0922 37.2695L82 0L96.9879 37.4698Z" fill="${svgColor}"/>
                                <circle cx="81.5" cy="117.5" r="70.5" fill="white"/>
                            </svg>
                            <img class="geology-img" src="${
                                planet["surface-geology-img"]
                            }" alt="Surface Geology" />
                        `;

                        planetContainer.appendChild(svgDiv);

                        // Функція для позиціонування SVG
                        function positionSVG() {
                            const planetImg = planetContainer.querySelector("img");
                            const planetImgRect = planetImg.getBoundingClientRect();
                            const planetContainerRect = planetContainer.getBoundingClientRect();
                            const svgDivRect = svgDiv.getBoundingClientRect();

                            const centerX = infoContainer.width / 2;

                            svgDiv.style.position = "absolute";
                            svgDiv.style.left = `${centerX}px`;
                            svgDiv.style.bottom = `0px`;
                        }

                        positionSVG();
                        window.addEventListener("resize", positionSVG);
                    }
                } else {
                    console.error("Missing data for section:", section);
                }
            }
        })
        .catch((error) => {
            console.error("Помилка при завантаженні або обробці даних:", error);
        });
});