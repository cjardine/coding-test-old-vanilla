const imagesPerPage = 6;
const body = document.body
const button = document.getElementById('button')
const list = document.getElementById('list')
const cardTemplate = document.getElementById('card')
let currentPage = 1;

function generateImageServiceUrl(imagesPerPage, currentPage) {
    return `https://picsum.photos/v2/list?page=${currentPage}&limit=${imagesPerPage}`;
}

async function getImages() {
    // add loading style
    body.classList.add('loading')

    // swap images
    const imagesJson = await fetch(generateImageServiceUrl(imagesPerPage, currentPage))
    const images = await imagesJson.json();
    const frag = document.createDocumentFragment();
    const imageUrlArray = createImageUrlArray(images)
    await loadImages(imageUrlArray);
    imageUrlArray.forEach((imageUrl) => createLi(imageUrl, frag))
    list.replaceChildren(frag)

    // remove loading style
    body.classList.remove('loading')
}

function createImageUrlArray(images) {
    const imageUrlArray = [];
    images.forEach((image) => imageUrlArray.push(createFinalImageUrl(image.download_url)))
    return imageUrlArray;
}
function createFinalImageUrl(download_url) {
    const finalUrlArray = download_url.split('/');
    finalUrlArray[5] = '300'
    finalUrlArray[6] = '300'
    return finalUrlArray.join('/')
}

function createLi(imageUrl, documentFragment) {
    const clone = cardTemplate.content.cloneNode(true)
    const $img = clone.querySelector('img');
    $img.setAttribute('src', imageUrl)
    $img.setAttribute('alt', ``)
    documentFragment.append(clone);
}

async function loadImages(imageUrlArray) {
    const promiseArray = []
    imageUrlArray.forEach(imageUrl => promiseArray.push(new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', resolve)
        image.src = imageUrl
    })))
    return Promise.all(promiseArray);
}

async function handleButton() {
    currentPage++;
    await getImages();
}

button.addEventListener('click', handleButton)
getImages()
.then()
