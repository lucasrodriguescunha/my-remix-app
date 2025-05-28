import { json, ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type Cheese = {
    id: number;
    name: string;
};

// Loader
export async function loader({ params }: LoaderFunctionArgs) {
    const response = await fetch("https://api.com/get-cheeses");
    const data: Cheese[] = await response.json();
    return json(data);
}

// Form Action
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    await fetch("https://api.com/add-cheese", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.get("cheese")?.toString() || "",
        }),
    });

    return redirect("/cheese");
}

export default function CheesePage() {
    const cheeses = useLoaderData<Cheese[]>();

    return (
        <div>
            <h1>Isso pode parecer pegajoso, mas quando penso em você me derreto!</h1>
            <ul>
                {cheeses.map((cheese) => (
                    <li key={cheese.id}>{cheese.name}</li>
                ))}
            </ul>
            <form action="/cheese" method="post">
                <input type="text" name="cheese" required />
                <button type="submit">Add Cheese</button>
            </form>
        </div>
    );
}
