const upload=require('./Multer');
const EntrepreneurUploads=upload.fields([
    { name: 'identityDocument', maxCount: 1 },
    { name: 'BusinessRegistrationDocument', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ])
const InvestorUploads=upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'pastInvestment', maxCount: 3},
    { name: 'verificationDocument', maxCount: 1 }
  ])
  module.exports={
    EntrepreneurUploads,
    InvestorUploads
  }