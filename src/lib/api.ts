export const editMp3 = async (formData: FormData) => {
    const res = await fetch("http://localhost:5000/api/edit", {
        method: "POST",
        body: formData,
      });
      
  
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
  
    return await res.json();
  };
  