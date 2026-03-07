import connectDb from "@/lib/db";

export default async function Home() {

  await connectDb()
  return (
    <div>
    hey there!!!  
    </div>
  );
}
