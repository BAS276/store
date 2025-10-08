import "../style/AdminContainer.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categorys = () => {
    const [categories, setCategories] = useState([]);
    const [isFormUpdateVisible, setIsFormUpdateVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        status: 'Active',
    });
    const [editCategoryId, setEditCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCategoryId) {
                await axios.put(`http://localhost:5000/api/categories/${editCategoryId}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/categories', formData);
            }
            setIsFormUpdateVisible(false);
            setFormData({ title: '', image: '', status: 'Active' });
            setEditCategoryId(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    // Handle edit category
    const handleEdit = (category) => {
        setFormData({
            title: category.title,
            image: category.image,
            status: category.status,
        });
        setEditCategoryId(category._id);
        setIsFormUpdateVisible(true);
    };

    // Handle delete category
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-content">
                <h2>Category:</h2>
                <div className="Add-New-Admin-btn">
                    <button onClick={() => setIsFormUpdateVisible(true)}>Add New Category</button>
                </div>
                {isFormUpdateVisible && (
                    <form className="AddProductForm" onSubmit={handleSubmit}>
                        <h2>{editCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
                        <label>
                            Category Title:
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Image URL:
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Status:
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </label>
                        <div className="div-button">
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormUpdateVisible(false);
                                    setFormData({ title: '', image: '', status: 'Active' });
                                    setEditCategoryId(null);
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                {!isFormUpdateVisible && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id}>
                                        <td>
                                            <img src={category.image} alt={category.title} className="category-image" />
                                        </td>
                                        <td>{category.title}</td>
                                        <td> <span className={`status ${category.status}`}>{category.status}</span></td>
                                        <td className="Btns-U-D">
                                            <button className="Btn-U-D" onClick={() => handleEdit(category)}>
                                                <img alt="img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAplJREFUaEPt2s1qFEEUBeBznsCVLpQgiI/gRjfiShAR8UkEFaNJxGCM//gkElwo7nSrG4WsBEURQRQCrsSVRwpmQMbuqVtd1T23ki7Iarpr7lenuqqGDrHHGveYFyN4tyc+Jjwm7GQEJJ0FsA7gKAAB+ADgBsnnKSVWMaUl3QKw2gJbI7lhRbsHS7oDYDkCukvymgXtGmzETp0mtFtwItaMdgmWdBLAK8sUbbhmmeS9tntdgkOxki4DeNAB/QfACZKvm+51C85Eb5G8UB04A/2RZNiv/2suEpb0CMA3kg+bipQUtpzNhOn9ieQRl2BJjwFcnBR3ZQ465Zn2OaVnsNNActFh0TpO8o2rhCWF6XupZZq2bi2SwqkrnL7a2lWS911tSy3JztbYJenoaWvwRcuI7TK9o9jQ6aDgjsdFS9Im7KBgSWFbMf2iaXj+Vkg2bkuSTpF8ad2yBkm4Y7LmZ9qKHSThQtjoM21F95pwYWwRdG/gnrABvU7ypjXR2et6AfeINa/Ggx08PGOLL1resUXBNWCLgWvBFgHXhM0G14bNAteI7QyuFdsJXDM2GVw7Ngmc8SYgduzdILkWu6jU5+aztKQfAPaX+uJJP5skVwr3Obc7E1jSYQCfCxeW/UOgSz1WcHhP86TLF7TcsxCs+RmWdBvA9ULghWFTwC8AnC4AXig2BfwTwL5M8MKxJrCkJQBfdgPWCj4PYCsD7CLZaf3RVTryP1KxcXCFtSb8DMCZmKzhc3dYK/g7gAOJ4FWSYStz1+ZOaUmHAHydU/UvANsA3v7zt03ytzvppKAY+ByAp5NrdwC8m8G9JxneuFfTYuBjAA4GKMncrcnFoERXaRdVFixiBBccTJddjQm7jKVgUWPCBQfTZVd/AeKSIEwckRiIAAAAAElFTkSuQmCC" />
                                            </button>
                                            <button className="Btn-U-D" onClick={() => handleDelete(category._id)}>
                                                <img alt="img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAABWVJREFUaEPtWknMXmMUfp6EmCJpzAuKKNLYGCJqqNjYEOmAWjYtaVUbVsQQrdK0ggUVVUMRK3SgEjYWKipoTLEQQxtDCQ0RIgSRPO7hfnJ7+t57z3u/+//9ov+bfJvvnul5z7nvGd5L7GOL+xheTAD+v3t8wsMTHs7cAUn3AFhN8utM1t3IJR0LYAnJm4eR43l7DWlJ8wGsA/AbgHsB3F0Y/HuOwZIOBGAgbwJwEID5JJ/MkdFE2xtgSYcA+BzAkRWF5mUz+JWIwZIuBvAEAPPuYO0CcBLJXyMy2mj6BLyq9IzXOY3k222G2HNJ5wB4K0G7iuStERltNL0AlnQ8gM8A7O8UbiB5ZZsR1eeS1gO4wvH8AeBUkl/myErR9gW4zshTSH6VY6SkyQC2JzZvPck5ObLGBLCkaQDe7DMMJdW9HueSTIV8eB+G8rAk438XwBlO4/cATiBpp3X2KlLbwQC+cAegyXkfwFkklS20ZBgW8CANef3zSD7V1ajyAKuTPVSa6gy4wQsfkPQez8ZeRs97AE7vM3qGAbwSwC0JJOE01LYLDWlqJcnb2vh7O7TKNPQJgAOc0OdIXtXFkDqevtNUJw83GHEiyW97BtxrmsoG3JCGVpC8vU+wA1l9pqkswA1pyLw6pWsaatukpjRF8sw2/urzXMDzyuLe65hL8ukcxbm0lU5sqBRYC1jS+QAudAfTQgDHJIxdngugA73ZujTB9x2ARyr//wngVZKp6i89xJO0CMCaDkaNEssCko95g5IelmS7dvQoWd/Blm9IVvvqf0TUAbZa+IgOSkaJZRfJPV6/OsAvAbhklKzvYMvLJC+NhvT1AB5wxD8U3ctDHRSPB8sSAIc7RTeQXB0FPBXAR47YWrJD+5ot9bUL5Sztl8TrOZXkxyHARlSc1DY8O8oxzCb5fF/G9iFH0mwAG52snSStJN1jNeXhxwFc7TjWkrSUNTJL0loAVh9U17piLn5NLmCbHz3rmHaQnDIyaP+NRJuZHedsmkPS5mxZHp4E4MfEuzGZ5M420JIuAmC/6tpCckv1jyhdSp8k23yblu4msrj5OIzkT1mAjVjSNgBnO8ZFRX6zMGpcku4oRCxzRMtJ2v//rShdDeDrEpljG0mbbydXY/MgaQUAP1nYRPLyEQH8QjHYm+FsaWxT2wBb8/CaE2hXHpaeGieHUc9F6fwGF87YD4CFrV3xVNd0klu7erhO6Hl13chAURRIlC4B2Lo5D8ycMYnkX50Al+/xi8Xs+TInYBnJO5vCOgokSpcAbC2pbxc3k5zZZFfrAECSlW0POiFvkLxgLwO2ftduPaprMcnGtjYC+GQAnzrBFjIWOrVXmFHPRemq+iXVpUwbM+0YysNlWKeS+8xi4L65TngUSJTOAbYsscHpri0nq3StHi4B2whlgVOwhuTivQQ4ZU+o7I0CTu3odpIW7skV9VyUznk4FXGzSFpeblxRwNllZhRIlG6AoqacbD1TBvwhwGVYp07FhSQfTW1pFEiUrgI4VU62Zo0ugFN5byNJ/3lCW1QN9VxSqpxsrQu6AE5VNlbaWWfS+YI6B31DORm+scwJ6boyM6wsB1zNa2LFzuvuWdamhwGX7/EmALOcwqUk7xoWTIRfkpWz/sIu60uhXMDXFgP6h51xW0lOjxg8LI2k1MGZvGGo05UL2EYpWZ8hDQsywB+awGQfWpW08I59SRMwZDxIGqcbKQOyPFy+x/ZJwzPjgSagY0ZxP2zta3hlAy5B2ydJc8NaxobwvqJbuzFXdCfAJWibWVtDcVpizJJrR5T+ZwAfFq3p/SQtY2SvzoCzNY0IwwTgEXHEmJkx4eEx29oREfw3S/JQW0Ow3UIAAAAASUVORK5CYII=" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categorys;