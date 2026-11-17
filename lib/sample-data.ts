/**
 * Demo products, used only when SHEET_ID is not set, so the site can be
 * tried out before a Google Sheet exists. Same columns as the real Sheet.
 * The same rows are in sample-sheet/products.csv, ready to import into Google Sheets.
 */
export const SAMPLE_CSV = `id,name,category,gender,price,sizes,colors,quantity,status,image_urls,description,featured
SH-001,Pulse Running Shoes,shoes,women,4200,"36, 37, 38, 39, 40","Purple, White",6,available,"https://res.cloudinary.com/demo/image/upload/shoes.jpg","Light, breathable running shoes with a cushioned sole. Comfortable from the first step, whether you run or walk all day.",yes
SH-002,Retro Air Sneakers,shoes,unisex,6500,"39, 40, 41, 42, 43","White, Tan, Pink",3,available,"https://res.cloudinary.com/demo/image/upload/samples/shoe.jpg, https://res.cloudinary.com/demo/image/upload/sneaker.jpg","A classic retro shape with soft leather panels and an air-cushioned heel. Goes with jeans, shorts and everything in between.",yes
SH-003,Stride Blue Trainers,shoes,men,4800,"40, 41, 42, 43, 44","Blue, Lime",8,available,"https://res.cloudinary.com/demo/image/upload/sneaker.jpg","Everyday trainers with a soft suede upper and a springy white sole.",yes
SH-004,Shadow Mesh Trainers,shoes,men,3900,"41, 42, 43","Black",0,sold_out,"https://res.cloudinary.com/demo/image/upload/docs/shoes.jpg","All-black mesh trainers with a neon lining. Light enough for the gym, smart enough for the street.",no
CL-001,Classic Polo Shirt,clothes,men,1500,"S, M, L, XL","White, Navy",12,available,"https://res.cloudinary.com/demo/image/upload/shirt.jpg","Soft cotton polo with a neat collar. A wardrobe staple for work or weekends.",yes
CL-002,Evening Wrap Dress,clothes,women,3800,"S, M, L","Royal Blue",2,available,"https://res.cloudinary.com/demo/image/upload/dress.jpg","Flowing chiffon dress with a satin waistband. Made for weddings, dinners and special nights.",yes
CL-003,Henley Long-Sleeve Top,clothes,women,1200,"S, M, L","Blue, Grey",9,available,"https://res.cloudinary.com/demo/image/upload/fashion1.jpg","Relaxed long-sleeve top in soft jersey with a button neckline.",no
CL-004,Puffer Vest,clothes,women,2900,"S, M, L, XL","Cobalt Blue",5,available,"https://res.cloudinary.com/demo/image/upload/docs/casual.jpg","Warm, lightweight hooded vest with zip pockets. Layers easily over a sweater.",yes
CL-005,Kids Snow Hoodie Jacket,clothes,kids,2200,"4Y, 6Y, 8Y, 10Y","Blue",4,available,"https://res.cloudinary.com/demo/image/upload/samples/people/boy-snow-hoodie.jpg","Cosy padded jacket with a deep hood to keep little ones warm.",no
CL-006,Colour-Block Knit Sweater,clothes,women,2600,"S, M, L","Cream, Rust",7,available,"https://res.cloudinary.com/demo/image/upload/samples/outdoor-woman.jpg","Chunky knit sweater with colour-block panels and a relaxed fit.",yes
CL-007,Tailored Blazer,clothes,men,5200,"48, 50, 52","Camel",0,sold_out,"https://res.cloudinary.com/demo/image/upload/samples/man-on-a-street.jpg","Sharp single-breasted blazer in a warm camel tone.",no
CL-008,Zip Hoodie,clothes,unisex,1900,"S, M, L, XL","Charcoal",10,available,"https://res.cloudinary.com/demo/image/upload/samples/people/smiling-man.jpg","Mid-weight zip hoodie in brushed cotton. Soft inside, tough outside.",yes
CL-009,Everyday Cotton T-Shirt,clothes,unisex,650,"S, M, L, XL","White, Black, Olive",20,available,,"Plain heavyweight cotton tee. (This row has no photo, so the site shows a placeholder.)",no
SH-099,Hidden Example Shoe,shoes,men,1000,"42","Black",1,hidden,"https://res.cloudinary.com/demo/image/upload/shoes.jpg","This row is hidden, so it never appears on the site.",no
`;
