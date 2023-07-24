import { ChangeEvent, useState } from 'react';

function TestForm() {
  const [bannerForm, setBannerForm] = useState([
    { name: '', description: '', price: null, rating: null },
  ]);

  const handleAddPlayers = () => {
    const values = [...bannerForm];
    values.push({
      name: '',
      description: '',
      price: null,
      rating: null,
    });
    setBannerForm(values);
  };

  const handleRemovePlayers = (index: number) => {
    const values = [...bannerForm];
    values.splice(index, 1);
    setBannerForm(values);
  };

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const values = [...bannerForm];
    const updatedValue = event.target.name;
    (values[index] as any)[updatedValue] = event.target.value;
    setBannerForm(values);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-2/3">
          <h3 className="text-center">Dynamic Form Fields</h3>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4 mb-8"
            onClick={handleAddPlayers}>
            Add Player
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-2/3">
          {bannerForm.length > 0 &&
            bannerForm.map((field, index) => (
              <div key={index} className="bg-gray-200 p-4 mb-4">
                <h4 className="text-lg font-bold">Player {index + 1}</h4>
                <div className="mb-4">
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={field.name}
                    onChange={event => {
                      handleInputChange(index, event);
                    }}
                    className="w-full rounded py-1 px-2 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    value={field.description}
                    onChange={event => {
                      handleInputChange(index, event);
                    }}
                    className="w-full rounded py-1 px-2 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter Price"
                    value={field.price ?? ''}
                    onChange={event => {
                      handleInputChange(index, event);
                    }}
                    className="w-full rounded py-1 px-2 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Enter Rating"
                    value={field.rating ?? ''}
                    onChange={event => {
                      handleInputChange(index, event);
                    }}
                    className="w-full rounded py-1 px-2 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => {
                    handleRemovePlayers(index);
                  }}>
                  Cancel
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TestForm;
