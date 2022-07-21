const puppeteer =  require('puppeteer');
const product_url = "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-ti-12gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6462956.p?skuId=6462956"

async function givePage(){
    const browser =  await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })    
    return page;
}


async function addToCart(page){
    await page.goto(product_url);
    await page.waitForSelector("button[class='c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button']");
    
    await page.evaluate(() => document.getElementsByClassName('c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button')[0].click());
    await page.waitForTimeout(2000);

    //  If checkout screen doesnt come up, click go to cart button to start checkout       
    await page.evaluate(() => document.getElementsByClassName('c-button c-button-secondary c-button-sm c-button-block')[0].click());
    console.log("Your product has been added to cart.");

    // Checkout
    await page.waitForNavigation();
    await page.waitForSelector("button[class='btn btn-lg btn-block btn-primary']");
    await page.evaluate(() => document.getElementsByClassName('btn btn-lg btn-block btn-primary')[0].click());

    //Continue as Guest    
    await page.waitForNavigation();
    await page.waitForSelector("button[class='c-button c-button-secondary c-button-lg cia-guest-content__continue guest']");
    await page.evaluate(() => document.getElementsByClassName('c-button c-button-secondary c-button-lg cia-guest-content__continue guest')[0].click());
    await page.waitForNavigation();
    await page.waitForSelector("button[class='c-button-link address-form__showAddress2Link']");
    await page.evaluate(() => document.getElementsByClassName('c-button-link address-form__showAddress2Link')[0].click());
    
}

//Fill out Shipping/Billing info
async function fillBilling(page){
    console.log("Entering Billing Information..."); 
    await page.waitForTimeout(1000);

    let input = await page.$("input[id='firstName']");
    await input.press('Backspace'); //This fixes the inconsistent typing
    await input.type(''); 
    
    input = await page.$("input[id='lastName']");
    await input.press('Backspace'); //This fixes the inconsistent typing
    await input.type('Espinosa');    

    await page.waitForSelector("#street");
    await page.focus('#street');
    await page.keyboard.type('');      
    await page.waitForTimeout(500);

    await page.waitForSelector("#street2");
    await page.focus('#street2');
    await page.keyboard.type('');    
    await page.waitForTimeout(500);

    await page.waitForSelector("#city");
    await page.focus('#city');
    await page.keyboard.type('');    
    await page.waitForTimeout(500);

    input = await page.$("input[id='zipcode']");
    await input.press('Backspace'); //This fixes the inconsistent typing
    await input.type('');    

    await page.waitForSelector("input[id='user.emailAddress']");
    await page.focus("input[id='user.emailAddress']");
    await page.keyboard.type('jespinos08@gmail.com');  

    await page.waitForSelector("input[id='user.phone']");
    await page.focus("input[id='user.phone']");
    await page.keyboard.type('');
    await page.waitForSelector("#state");
    await page.select('#state', '' );
    await page.evaluate(() => document.getElementsByClassName('btn btn-lg btn-block btn-secondary')[0].click());
   
    console.log("Billing Info has been entered.");
}

async function fillPayment(page){
    await page.waitForNavigation();
    await page.waitForTimeout(2000);
    await page.waitForSelector("input[id='optimized-cc-card-number']");
    await page.focus("input[id='optimized-cc-card-number']");
    await page.keyboard.type('4263982640269299');    
    await page.waitForSelector("select[name='expiration-month']");
    await page.select("select[name='expiration-month']", '02');
    await page.waitForSelector("select[name='expiration-year']");
    await page.select("select[name='expiration-year']", '2023');
    await page.waitForSelector('#credit-card-cvv');
    await page.focus('#credit-card-cvv');
    await page.keyboard.type('837');
    await page.waitForTimeout(1000);
    
}

async function submitOrder(page){    
    await page.evaluate(() => document.getElementsByClassName('btn btn-lg btn-block btn-primary')[0].click());
    console.log("Your product has been successfully purchased!");
    
}

async function checkout() {
    let page = await givePage();
    await addToCart(page);    
    await fillBilling(page);
    await fillPayment(page);
    await submitOrder(page);
    await page.screenshot({ path: 'screenshot.png' });
}

checkout();