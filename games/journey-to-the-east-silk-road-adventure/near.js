// // Access the near-api-js library directly
const nearAPI = window.nearApi;

var brownie = false
brownNum = 0,
loggedIn = false,
userName=""

async function initializeNear(){
    try {
          // Initialize NEAR
          const near = await nearAPI.connect({
            networkId: 'mainnet',
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'Brown Game'),
            nodeUrl: 'https://rpc.mainnet.near.org',
            walletUrl: 'https://wallet.mainnet.near.org', // NEAR Wallet URL
            deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() },
        });
        window.walletConnection = new nearAPI.WalletConnection(near, "silk-road-near-arcade")
        if(window.walletConnection.isSignedIn()){
            loggedIn=true
            buttons[17].label="logout"
            checkNFT()
        }
    }catch(e){
        console.log(e)
    }
    }

async function checkNFT() {
    try {
         userName = window.walletConnection.account().accountId
         const contractId = 'mrbrownproject.near'
         const args = { "account_id": window.walletConnection.getAccountId() }; // Use the authenticated user's account
         
         var account = window.walletConnection.account()
         const contract = new nearAPI.Contract(account, contractId, {
             viewMethods: ["nft_tokens_for_owner"],
         })

         const result = await contract.nft_tokens_for_owner(args);
         //console.log('View method result:', result);
         
         if (result.length > 0) {
            brownie=true
            brownNum= result.length
            //console.log("You have " + result.length + " Mr. Brown NFTs!");
         }
     
 } catch (error) {
     console.error('Error:', error);
 }
}

function logOut(){
    window.walletConnection.signOut()
}

async function login(){
try{
    await window.walletConnection.requestSignIn("brown.neararcade.near", 'Check Your NFTs on Mr. Brown');
}catch(e){
    console.log(e)
}
}
