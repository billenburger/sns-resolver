# sns-resolver
Automatically parse a list of Bonfida Solana Naming Service (SNS), @twitter, and standard Solana wallets, output to file. 

Requirements:
`node.js`

1. Import list that needs to be resolved to the directory as `input.txt`
2. cd to directory and run `npm install`
3. Run `npx ts-node ./src/app.ts -i input.txt`
4. View `output.txt`

Optional argument:
Remove duplicate resolved addresses: `-d` 

No idea if this works without the `, 1`. I need it this way to work with the distribution tools
Ty @praskOo
