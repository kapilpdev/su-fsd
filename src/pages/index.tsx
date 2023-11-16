import { useEffect, useState } from "react";

interface DataItem {
  createdAt: string;
  fileName: string;
}

const Home = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const fetchData = (url: string) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => setData(jsonData.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData("/api/data");
  }, []); // Fetch data on initial render only

  const handleSortChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    try {
      let url = "/api/data"; // Default URL for unsorted data
      switch (selectedValue) {
        case "caAsc":
          url = "/api/sortedData";
          break;
        case "fnAsc":
          url = "/api/sortedByFileName";
          break;
        case "fnDesc":
          url = "/api/sortedByDescFileName";
          break;
        default:
          break;
      }
      await fetchData(url);
    } catch (error) {
      console.error("Error fetching sorted data:", error);
    }
  };

  return (
    <div className="p-2" style={{fontFamily: "'Delicious Handrawn', cursive"}} >
      <div className="border rounded-lg">
        <div className="mt-5 mb-5 py-5 justify-center flex">
          <select
            id="order"
            className=" text-center bg-black border border-gray-300 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-2 pr-2.5 py-2"
            onChange={handleSortChange}
          >
            <option value="caAsc">sort by created at ascendant</option>
            <option value="fnAsc">sort by filename ascendant</option>
            <option value="fnDesc">sort by filename descendant</option>
          </select>
        </div>
        <div className="w-4/5 mx-auto py-6">
          <div className="grid grid-cols-2 gap-10">
          {data.map((item, index) => (
            <div key={index} className="border rounded-2xl grid p-3">
              <p className="text-xs pb-2">{item.createdAt}</p>
              <p>{item.fileName}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>  
  );
};

export default Home;
