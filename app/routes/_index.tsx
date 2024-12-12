import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { addUser, findUserByEmailPassword, User } from "users";

import { v4 as uuidv4 } from "uuid";

type ActionData = {
  error?: string;
  user?: User;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Action ini berjalan di server
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return Response.json({
      error: "Email and password are required",
      status: 400,
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  const existingUser = findUserByEmailPassword(email, password);
  const user = existingUser || newUser;

  if (!existingUser) {
    addUser(user);
  }

  return Response.json({ user }, { status: 200 });
};

export default function Index() {
  // ketika disini , action berjalan di client
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userLogged");

    if(storedUser) {
      const user = JSON.parse(storedUser);
      location.pathname = `/profile/${user.id}`
    }

    if (actionData?.user) {
      localStorage.setItem("userLogged", JSON.stringify(actionData.user));
      navigate(`/profile/${actionData.user.id}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <Form method="post" className="space-y-6 mt-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-2 block w-full px-4 py-2 bg-slate-100 focus:outline-none text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-2 block w-full px-4 py-2 bg-slate-100 focus:outline-none text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-2 block w-full px-4 py-2 bg-slate-100 focus:outline-none text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
