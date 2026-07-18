import Product from "@/models/Product";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const getAllProducts = async ({
  search,
  category,
  featured,
  page,
  limit,
  sort,
}) => {
  const query = {
    status: "active",
  };

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (featured === "true") {
    query.featured = true;
  }

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case "latest":
      sortOption = { createdAt: -1 };
      break;

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "price_asc":
      sortOption = { price: 1 };
      break;

    case "price_desc":
      sortOption = { price: -1 };
      break;

    case "rating":
      sortOption = { rating: -1 };
      break;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return {
    products,
    total,
  };
};

export const getProductBySlug = async (slug) => {
  return await Product.findOne({
    slug,
    status: "active",
  });
};

export const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(
    id,
    {
      status: "inactive",
    },
    {
      new: true,
    },
  );
};

export const findProductBySlug = async (slug) => {
  return await Product.findOne({ slug });
};