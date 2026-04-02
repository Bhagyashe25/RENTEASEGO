import logo from "./logo.png";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg"
import close_icon from "./close_icon.svg"
import users_icon from "./users_icon.svg"
import location_icon from "./location_icon.svg"
import addIcon from "./addIcon.svg"
import dashboardIcon from "./dashboardIcon.svg"
import dashboardIconColored from "./dashboardIconColored.svg"
import addIconColored from "./addIconColored.svg"
import listIcon from "./listIcon.svg"
import listIconColored from "./listIconColored.svg"
import cautionIconColored from "./cautionIconColored.svg"
import arrow_icon from "./arrow_icon.svg"
import star_icon from "./star_icon.svg"
import check_icon from "./check_icon.svg"
import tick_icon from "./tick_icon.jpg"
import delete_icon from "./delete_icon.svg"
import eye_icon from "./eye_icon.svg"
import eye_close_icon from "./eye_close_icon.svg"
import filter_icon from "./filter_icon.svg"
import edit_icon from "./edit_icon.svg"
import calendar_icon_colored from "./calendar_icon_colored.svg"
import location_icon_colored from "./location_icon_colored.svg"
import testimonial_image_1 from "./testimonial_image_1.png"
import testimonial_image_2 from "./testimonial_image_2.png"
import user_profile from "./user_profile.png"
import upload_icon from "./upload_icon.svg"
import category_icon from './category_icon.png'
import tenure_icon from './tenure_icon.png'
import sofa from './sofa.jpg'
import bed from './bed.jpg'
import table from './table.jpg'
import refrigerator from './refrigerator.jpg'
import smartTV from './smartTV.jpg'
import washingMachine  from './washingMachine.jpg'
import freelocation from './freelocation.jpg'
import order_img from './order_img.jpg'
import maintain_img from './maintain_img.jpg'
import furniture_icon from './furniture_icon.png'
import all_img from './all_img.jpg'
import dispute_icon from './dispute_icon.png'
import report_icon from './report_icon.png'
import service_img from './service_img.jpg'
import cart from './cart.png'



export const cityList = ['New York', 'Los Angeles', 'Houston', 'Chicago']

export const assets = {
    logo,
    gmail_logo,
    facebook_logo,
    instagram_logo,
    twitter_logo,
    menu_icon,
    search_icon,
    close_icon,
    users_icon,
    edit_icon,
    location_icon,
    addIcon,
    dashboardIcon,
    dashboardIconColored,
    addIconColored,
    listIcon,
    listIconColored,
    cautionIconColored,
    calendar_icon_colored,
    location_icon_colored,
    arrow_icon,
    star_icon,
    check_icon,
    tick_icon,
    delete_icon,
    eye_icon,
    eye_close_icon,
    filter_icon,
    testimonial_image_1,
    testimonial_image_2,
    upload_icon,
    user_profile,
    category_icon,
    tenure_icon,
    sofa,
    bed,
    table,
    refrigerator,
    smartTV,
    washingMachine,
    freelocation,
    order_img,
    maintain_img,
    furniture_icon,
    all_img,
    dispute_icon,
    report_icon,
    service_img,
    cart
}
export const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "My-Rentals", path: "/my-rentals" },
    { name: "MyCart", path: "/cart" },
]

// export const ownerMenuLinks = [
//     { name: "Dashboard", path: "/admin", icon: dashboardIcon, coloredIcon: dashboardIconColored },
//     { name: "Add Product", path: "/admin/add-product", icon: addIcon, coloredIcon: addIconColored },
//     { name: "Manage Products", path: "/admin/manage-products", icon: carIcon, coloredIcon: carIconColored },
//     { name: "Manage Orderss", path: "/admin/manage-orders", icon: listIcon, coloredIcon: listIconColored },
// ]

export const dummyUserData = {
  "_id": "6847f7cab3d8daecdb517095",
  "name": "GreatStack",
  "email": "admin@example.com",
  "role": "admin",
  "image": user_profile,
}

export const productCategories = [
  {
    "id": "cat001",
    "name": "Furniture",
    "items": ["Bed", "Sofa", "Table"]
  },
  {
    "id": "cat002",
    "name": "Appliances",
    "items": ["Fridge", "Washing Machine", "TV"]
  }
];

export const dummyProductData = [
  {
    "_id": "prod001",
    "category": "Furniture",
    "type": "Sofa",
    "name": "3-Seater Fabric Sofa",
    "image": sofa,
    "rentalPrice": 499,
    "securityDeposit": 2000,
    "tenureOptions": ["1 Month", "3 Months", "6 Months"],
    "description": "Comfortable 3-seater sofa perfect for living rooms.",
    "isAvailable": true
  },
  {
    "_id": "prod002",
    "category": "Furniture",
    "type": "Bed",
    "name": "Queen Size Wooden Bed",
    "image": bed,
    "rentalPrice": 699,
    "securityDeposit": 2500,
    "tenureOptions": ["1 Month", "6 Months", "12 Months"],
    "description": "Durable wooden queen bed with modern design.",
    "isAvailable": true
  },
  {
    "_id": "prod003",
    "category": "Furniture",
    "type": "Table",
    "name": "Queen Size Wooden Table",
    "image": table,
    "rentalPrice": 699,
    "securityDeposit": 2500,
    "tenureOptions": ["1 Month", "6 Months", "12 Months"],
    "description": "Durable wooden table with modern design.",
    "isAvailable": true
  },
  {
    "_id": "prod004",
    "category": "Appliances",
    "type": "Fridge",
    "name": "Double Door Refrigerator",
    "image": refrigerator,
    "rentalPrice": 799,
    "securityDeposit": 3000,
    "tenureOptions": ["1 Month", "3 Months", "6 Months"],
    "description": "Energy efficient refrigerator with large capacity.",
    "isAvailable": true
  },
  {
    "_id": "prod005",
    "category": "Appliances",
    "type": "TV",
    "name": "43 Inch Smart TV",
    "image": smartTV,
    "rentalPrice": 599,
    "securityDeposit": 2500,
    "tenureOptions": ["1 Month", "3 Months", "6 Months"],
    "description": "Full HD Smart TV with streaming apps support.",
    "isAvailable": true
  },
  {
   "_id": "prod006",
    "category": "Appliances",
    "type": "Washing Machine",
    "name": "Front Load Washing Machine",
    "image": washingMachine,
    "rentalPrice": 649,
    "securityDeposit": 2200,
    "tenureOptions": ["1 Month", "3 Months", "6 Months"],
    "description": "Fully automatic washing machine with multiple modes.",
    "isAvailable": true
  }
];

export const dummyCartData = [
  {
    "_id": "cart001",
    "product": dummyProductData[0],
    "user": "user001",
    "admin": "admin001",
    "tenure": "1 Month",
    "status": "confirmed",
    "price": 499,
    "securityDeposit": 2000,
    "createdAt": "2025-06-10T10:20:15.120Z"
  },
  {
    "_id": "cart002",
    "product": dummyProductData[1],
    "user": "user001",
    "admin": "admin001",
    "tenure": "6 Months",
    "status": "pending",
    "price": 699,
    "securityDeposit": 2500,
    "createdAt": "2025-06-10T11:15:25.613Z"
  },
  {
    "_id": "cart003",
    "product": dummyProductData[2],
    "user": "user001",
    "admin": "admin001",
    "tenure": "3 Months",
    "status": "pending",
    "price": 699,
    "securityDeposit": 2500,
    "createdAt": "2025-06-10T12:05:06.379Z"
  },
  {
    "_id": "cart004",
    "product": dummyProductData[3],
    "user": "user001",
    "admin": "admin001",
    "tenure": "1 Month",
    "status": "confirmed",
    "price": 799,
    "securityDeposit": 3000,
    "createdAt": "2025-06-10T12:30:45.410Z"
  },
  {
    "_id": "cart005",
    "product": dummyProductData[4],
    "user": "user001",
    "admin": "admin001",
    "tenure": "3 Months",
    "status": "confirmed",
    "price": 599,
    "securityDeposit": 2500,
    "createdAt": "2025-06-10T13:10:10.210Z"
  }
];

export const productDetail = {
  "_id": "prod001",
  "name": "3-Seater Fabric Sofa",
  "category": "Furniture",
  "rentalPrice": 499,
  "securityDeposit": 2000,
  "tenureOptions": ["1 Month", "3 Months", "6 Months"],
  "description": "Comfortable sofa ideal for small and medium living rooms."
};
export const dummyDashboardData = {
  "totalProducts": 5,
  "totalOrder": 5,
  "pendingOrder": 2,
  "completedOrder": 3,
  "recentOrder": [
    dummyCartData[3],
    dummyCartData[4]
  ],
  "monthlyRevenue": 3295
};