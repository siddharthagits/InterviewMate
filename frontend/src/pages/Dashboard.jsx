import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";

function Dashboard() {
  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold">
        Welcome 👋
      </h1>

      <p className="text-gray-500 mt-2">
        Ready for today's interview?
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <Card>
          <h2 className="text-3xl font-bold text-blue-600">
            12
          </h2>

          <p>Interviews Completed</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-bold text-green-600">
            84%
          </h2>

          <p>Average Score</p>
        </Card>

        <Card>
          <h2 className="text-3xl font-bold text-purple-600">
            7
          </h2>

          <p>Current Streak</p>
        </Card>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;