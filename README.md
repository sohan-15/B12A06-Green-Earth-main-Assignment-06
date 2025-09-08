#### 1) What is the difference between var, let, and const?

var → পুরনো ব্যাগ, যেখানেই রাখো বাইরে থেকেও পাওয়া যায়। একই নামে আবার বানানো যায়।

let → নতুন ব্যাগ, শুধু যেই ঘরে (block) আছে সেখানেই কাজ করবে। মান বদলানো যায়।

const → লোহার বাক্স, একবার রাখলে আর বদলানো যায় না।

#### 2) What is the difference between map(), forEach(), and filter()?

forEach → শুধু ঘুরে দেখা, নতুন কিছু ফেরত দেয় না।

map → প্রতিটা জিনিস থেকে নতুন অ্যারে বানায়।

filter → শর্ত মিলে যেগুলো ঠিক, সেগুলো নিয়ে নতুন অ্যারে বানায়।

#### 3) What are arrow functions in ES6?

Shortcut function। ছোট করে লেখা যায়।

function add(a, b) { return a+b }
vs
const add = (a, b) => a + b;

#### 4) How does destructuring assignment work in ES6?

ব্যাগ থেকে একসাথে জিনিস বের করার মতো।

const {tomato, onion} = bag;

#### 5) Explain template literals in ES6. How are they different from string concatenation?

Backtick (``) ব্যবহার করে string লিখা।

${variable} দিয়ে ভেতরে ভ্যারিয়েবল বসানো যায়।

লম্বা string বা নতুন লাইন সহজে লেখা যায়।
