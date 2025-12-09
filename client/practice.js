// function odd(arr){
//     const result=[];
//     for(let i=0;i<arr.length;i++){
//         if(arr[i]%2!=0){
//             result.push(arr[i]);
//         }
//     }
//     return result;
// }
// console.log(odd([1,2,3,4,5]));

// const result=arr.reduce((cv,acc)=>{
//     return cv+acc;
// })
// console.log(result);
// function add(arr){
//     const added=[];
//     arr.map(ele=>{
//         if(ele%2!=0){
//             added.push(ele+3)
//         }else{
//             added.push(ele)
//         }
//     });
//     return added;
// }
// console.log(add([1,2,3,4,5]))
// const obj={a:1,b:2,c:3};
// let sum=0;
// for(let key in obj){
//     sum+=obj[key];
// }
// console.log(sum)
// const str='abc';
// const obj={};
// for(let i=0;i<str.length;i++){
//     obj[str[i]]=str[i].toUpperCase()
// }
// console.log(obj)
let n=0
for(let i=0;i<n;i++){
    for(let j=0;j<n+1;j++){
        console.log(i)
    }
}