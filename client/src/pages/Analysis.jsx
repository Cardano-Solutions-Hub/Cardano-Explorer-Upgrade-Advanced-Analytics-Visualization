import ChartComponent from "../components/AnalysisChart";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
function Analysis() {
    return (
        <div>
            <NavBar />
            <main className="flex flex-col lg:flex-row bg-primaryBg">
                <Menu />
                <div className="ml-2 sm:ml-6 lg:ml-28 flex-1">
                    <ChartComponent />
                </div>
            </main>
        </div>
    );
}

export default Analysis;