export default function GetStartedPage() {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col items-center px-6 py-24">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Get Started with <span className="text-purple-400">Phi.ai</span>
          </h1>
  
          <p className="text-lg text-gray-300 leading-relaxed">
            Everything you need to begin building with Phi.  
            Follow the quick setup steps below and you’ll be ready in minutes.
          </p>
        </div>
  
        <div className="mt-16 max-w-2xl w-full space-y-8">
          <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">1. Install</h2>
            <pre className="bg-black/70 p-4 rounded-lg border border-white/10 text-sm">
              <code>npm install phi-sdk</code>
            </pre>
          </section>
  
          <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">2. Import the SDK</h2>
            <pre className="bg-black/70 p-4 rounded-lg border border-white/10 text-sm overflow-x-auto">
              <code>{`import { Phi } from "phi-sdk";
  
  const client = new Phi({
    apiKey: process.env.PHI_API_KEY
  });`}</code>
            </pre>
          </section>
  
          <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">3. Make your first request</h2>
            <pre className="bg-black/70 p-4 rounded-lg border border-white/10 text-sm overflow-x-auto">
              <code>{`const response = await client.generate({
    model: "phi-latest",
    prompt: "Hello world"
  });
  
  console.log(response);`}</code>
            </pre>
          </section>
        </div>
  
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Join our Discord or check the full documentation.
          </p>
        </div>
      </div>
    );
  }
  