export const products = {
    pageTitle: 'Automation Exercise - All Products',
    allProducts: '//h2[text()="All Products"]',
    viewProduct: (index: number) => `(//a[text()="View Product"])[${index}]`,
    writeReview: '//a[text()="Write Your Review"]',
    productName: '//div[@class="product-information"]//child::h2',
    category: '//div[@class="product-information"]//child::p[1]',
    availability: '//div[@class="product-information"]//child::p[2]',
    condition: '//div[@class="product-information"]//child::p[3]',
    price: '//div[@class="product-information"]//span//span',
    brand: '//div[@class="product-information"]//child::p[4]'
}