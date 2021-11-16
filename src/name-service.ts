import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@solana/spl-name-service';
import { Connection, PublicKey } from '@solana/web3.js';

const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
);

export const resolveSolDomain = async (
  connection: Connection,
  input: string
) => {
  const { inputDomainKey } = await getInputKey(input);
  const { owner } = await NameRegistryState.retrieve(
    connection,
    inputDomainKey
  );
  return owner;
};

export const getInputKey = async (input: string) => {
  let hashed_input_name = await getHashedName(input);
  let inputDomainKey = await getNameAccountKey(
    hashed_input_name,
    undefined,
    SOL_TLD_AUTHORITY
  );
  return { inputDomainKey: inputDomainKey, hashedInputName: hashed_input_name };
};
