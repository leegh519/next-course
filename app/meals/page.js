import Link from "next/link";

export default function MealsPage() {
  return (
    <main>
      <h1>meals</h1>
      <p>
        <Link href="/meals/share">share</Link>
      </p>
      <p>
        <Link href="/meals/meal-1">meals-1</Link>
      </p>
    </main>
  );
}
