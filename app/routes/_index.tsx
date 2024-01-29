import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { promises as fs } from "fs";
import { Accout } from "~/types";

export const loader = async () => {
  const jsonDirectory = "app/data";
  // Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + "/accounts.json", "utf8");
  // Parse the json data file contents into a json object
  const data = JSON.parse(fileContents) as Record<string, Accout>;

  return json({
    accounts: data,
  });
};

export default function Index() {
    const {accounts} = useLoaderData<typeof loader>();
    return (
        <div>
            {Object.values(accounts).map(account => <div key={account.id}>{account.displayName}</div>)}
        </div>
    )
}
