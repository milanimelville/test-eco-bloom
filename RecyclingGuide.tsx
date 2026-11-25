import { useMemo, useState } from "react";
// @ts-ignore CSS side-effect imports are resolved by the bundler.
import "./RecyclingGuide.css";

type BinId = "general" | "recyclables" | "food";

interface Group {
  title: string;
  items: string[];
}

interface Bin {
  id: BinId;
  name: string;
  summary: string;
  prep: string;
  groups: Group[];
}

const BINS: Bin[] = [
  {
    id: "general",
    name: "General waste",
    summary:
      "Non-biodegradable items that cannot be reused or repurposed. Bag them and put them in the general waste bin.",
    prep: "Bag it and bin it.",
    groups: [
      {
        title: "Plastic and sports gear",
        items: ["Plastic wrap", "Plastic toys", "Sporting goods equipment"],
      },
      {
        title: "Ceramics and kitchenware",
        items: ["Dishes", "Glassware"],
      },
      {
        title: "Hazardous waste",
        items: ["Chemicals and their containers"],
      },
      {
        title: "Non-biodegradable materials",
        items: ["Foam egg cartons", "Packing peanuts", "Bubble wrap"],
      },
      {
        title: "Miscellaneous",
        items: [
          "Used paper plates",
          "Used paper towels",
          "Used paper napkins",
          "Photographs",
          "Wood",
          "Yard waste",
          "Garden tools",
        ],
      },
      {
        title: "Other non-recyclables",
        items: ["Wax boxes", "Windows", "Mirrors"],
      },
    ],
  },
  {
    id: "recyclables",
    name: "Recyclables",
    summary:
      "Materials that can be collected, processed, and made into new products.",
    prep: "Clean or flatten before recycling.",
    groups: [
      {
        title: "Accepted items",
        items: [
          "Paper containers",
          "Aluminum cans",
          "Plastic containers",
          "Glass containers",
          "Dry batteries",
          "Electronics",
          "Light bulbs",
          "Clean clothes",
          "DVDs and CDs",
        ],
      },
    ],
  },
  {
    id: "food",
    name: "Food waste",
    summary:
      "Spoiled or uneaten food, and raw or cooked leftovers without excess liquid.",
    prep: "Remove packaging and use the designated food bin.",
    groups: [
      {
        title: "Accepted items",
        items: [
          "Spoiled food",
          "Uneaten food",
          "Raw leftovers",
          "Cooked leftovers (no excess liquid)",
        ],
      },
    ],
  },
];

const BENEFITS = [
  {
    title: "Conserves natural resources",
    text: "Recycling reduces the need to extract resources such as timber, water, and minerals for new products.",
  },
  {
    title: "Saves energy",
    text: "Recycling just 10 plastic bottles saves enough energy to power a laptop for more than 25 hours.",
  },
  {
    title: "Cuts waste and pollution",
    text: "Recycling diverts waste away from landfills and incinerators, which reduces the harmful effects of pollution and emissions.",
  },
];

const LOOK_FOR = [
  {
    term: "Easily recycled",
    text: "Products that can be collected, processed, and manufactured into new products after use.",
  },
  {
    term: "Recycled content",
    text: "Products made with recycled materials, either from a recycling program or from waste recovered during manufacturing.",
  },
  {
    term: "Post-consumer content",
    text: "Similar to recycled content, but the material comes only from recyclables collected from consumers or businesses.",
  },
];

const ALL_ITEMS = BINS.flatMap((bin) =>
  bin.groups.flatMap((group) =>
    group.items.map((item) => ({ item, bin: bin.id, binName: bin.name }))
  )
);

export default function RecyclingGuide() {
  const [active, setActive] = useState<BinId>("general");
  const [query, setQuery] = useState("");

  const bin = BINS.find((b) => b.id === active) ?? BINS[0];
  const q = query.trim().toLowerCase();

  const results = useMemo(
    () => (q ? ALL_ITEMS.filter((r) => r.item.toLowerCase().includes(q)) : []),
    [q]
  );

  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = BINS.findIndex((b) => b.id === active);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = BINS[(i + step + BINS.length) % BINS.length];
    setActive(next.id);
    document.getElementById("rg-tab-" + next.id)?.focus();
  };

  return (
    <main className="recycling-page">
      <section className="rg-hero">
        <div className="rg-hero-inner">
          <h1>
            Put it in the right bin.
            <br />
            <em>Give it another life.</em>
          </h1>
          <p className="rg-lede">
            Recycling turns materials that would be thrown away into new
            products. It benefits your community, the economy, and the
            environment. Recycle only what you cannot reduce or reuse first.
          </p>
        </div>
      </section>

      <section className="rg-sorter" aria-labelledby="rg-sort-heading">
        <h2 id="rg-sort-heading">Sort waste into three bins</h2>

        <div
          className="rg-tabs"
          role="tablist"
          aria-label="Waste bins"
          onKeyDown={onTabKey}
        >
          {BINS.map((b) => (
            <button
              key={b.id}
              id={"rg-tab-" + b.id}
              role="tab"
              type="button"
              aria-selected={active === b.id}
              aria-controls={"rg-panel-" + b.id}
              tabIndex={active === b.id ? 0 : -1}
              className={"rg-tab rg-tab--" + b.id}
              onClick={() => setActive(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div
          key={bin.id}
          role="tabpanel"
          id={"rg-panel-" + bin.id}
          aria-labelledby={"rg-tab-" + bin.id}
          className={"rg-panel rg-panel--" + bin.id}
        >
          <p className="rg-summary">{bin.summary}</p>
          <p className="rg-prep">{bin.prep}</p>
          <div className="rg-groups">
            {bin.groups.map((g) => (
              <div key={g.title} className="rg-group">
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rg-lookup" aria-labelledby="rg-lookup-heading">
        <h2 id="rg-lookup-heading">Not sure where something goes?</h2>
        <label htmlFor="rg-search" className="rg-label">
          Search for an item
        </label>
        <input
          id="rg-search"
          type="search"
          className="rg-search"
          placeholder="Try “mirrors” or “batteries”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div aria-live="polite" className="rg-results">
          {q && results.length === 0 && (
            <p className="rg-empty">
              No match for “{query.trim()}”. Check the lists above for similar
              items.
            </p>
          )}
          {results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.bin + r.item}>
                  <span className="rg-result-item">{r.item}</span>
                  <span className={"rg-badge rg-badge--" + r.bin}>
                    {r.binName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rg-benefits" aria-labelledby="rg-benefits-heading">
        <h2 id="rg-benefits-heading">Why recycling matters</h2>
        <p className="rg-benefits-intro">
          By recycling our materials, we create a healthier planet for
          ourselves and future generations.
        </p>
        <div className="rg-benefit-grid">
          {BENEFITS.map((b) => (
            <article key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rg-loop" aria-labelledby="rg-loop-heading">
        <h2 id="rg-loop-heading">Close the loop when you shop</h2>
        <p className="rg-loop-intro">
          You help close the recycling loop by buying products made from
          recycled materials. When you go shopping, look for:
        </p>
        <dl>
          {LOOK_FOR.map((l) => (
            <div key={l.term} className="rg-loop-row">
              <dt>{l.term}</dt>
              <dd>{l.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rg-cta">
        <h2>
          Reduce first. Reuse next.
          <br />
          <em>Recycle what is left.</em>
        </h2>
        <a href="/ideas" className="rg-pill">
          Explore upcycling ideas
        </a>
      </section>
    </main>
  );
}
