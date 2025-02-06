"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export function LatestProduct() {
  const [latestProduct] = api.product.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");

  const createProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      setName("");
      setIngredients("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestProduct ? (
        <p className="truncate">Your most recent product: {latestProduct.name}</p>
      ) : (
        <p>You have no products yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct.mutate({ name, ingredients });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createProduct.isPending}
        >
          {createProduct.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
