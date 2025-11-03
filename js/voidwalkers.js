const characterData = {
    "danteh": {
        "title": "Danteh",
        "subtitle": "400 Health",
        "description": "Solider for the United Republic",
        "img": "imgs/voidwalker-icons/danteh.png"
    },
    "exo": {
        "title": "Exo",
        "subtitle": "400 Health",
        "description": "Civilian Engineer loyal to the United Republic",
        "img": "imgs/voidwalker-icons/exo.png"
    },
    "janus": {
        "title": "Janus",
        "subtitle": "400 Health",
        "description": "Emperor of the Immortal Empire",
        "img": "imgs/voidwalker-icons/janus.png"
    },
    "lancer": {
        "title": "Lancer",
        "subtitle": "400 Health",
        "description": "Soldier for the United Republic",
        "img": "imgs/voidwalker-icons/lancer.png"
    },
    "cane": {
        "title": "Cane",
        "subtitle": "200 Health",
        "description": "Soldier for the United Republic",
        "img": "imgs/voidwalker-icons/cane.png"
    },
    "carpe": {
        "title": "Carpe",
        "subtitle": "200 Health",
        "description": "Soldier for the Immortal Empire",
        "img": "imgs/voidwalker-icons/carpe.png"
    },
    "im-94": {
        "title": "IM-94",
        "subtitle": "200 Health",
        "description": "Cyborg Soldier for the Immortal Empire",
        "img": "imgs/voidwalker-icons/im-94.png"
    },
    "mae": {
        "title": "Mae",
        "subtitle": "200 Health",
        "description": "Commander in the Immortal Empire",
        "img": "imgs/voidwalker-icons/mae.png"
    },
    "nyx": {
        "title": "Nyx",
        "subtitle": "200 Health",
        "description": "Bounty Hunter hired by the United Republic",
        "img": "imgs/voidwalker-icons/nyx.png"
    },
    "qin": {
        "title": "Qin",
        "subtitle": "200 Health",
        "description": "Supreme Commander of the Immortal Empire's Military",
        "img": "imgs/voidwalker-icons/qin.png"
    },
    "d-11": {
        "title": "D-11",
        "subtitle": "200 Health",
        "description": "Cyborg Soldier for the Immortal Empire",
        "img": "imgs/voidwalker-icons/d-11.png"
    },
    "moka": {
        "title": "Moka",
        "subtitle": "200 Health",
        "description": "Civilian Doctor loyal to the United Republic",
        "img": "imgs/voidwalker-icons/moka.png"
    },
    "raze": {
        "title": "Raze",
        "subtitle": "200 Health",
        "description": "A Medic for the United Republic",
        "img": "imgs/voidwalker-icons/raze.png"
    },
    "vex": {
        "title": "Vex",
        "subtitle": "200 Health",
        "description": "A Mysterious Lady in the ranks on the Immortal Empire",
        "img": "imgs/voidwalker-icons/vex.png"
    }
};

document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
        const imgElement = item.querySelector('img');
        const key = imgElement.alt.toLowerCase();
        const data = characterData[key];
        if (data) {
            document.getElementById('popup-image').src = data.img;
            document.getElementById('popup-title').textContent = data.title;
            document.getElementById('popup-subtitle').textContent = data.subtitle;
            document.getElementById('popup-description').textContent = data.description;
            document.getElementById('character-popup').classList.remove('hidden');
        }
    });
});

function closePopup() {
    document.getElementById('character-popup').classList.add('hidden');
}