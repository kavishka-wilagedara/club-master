package com.uokclubmanagement.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    // Upload image into cloudinary
    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("url").toString(); // Get the image url
    }

    // Delete image from cloudinary
    public void deleteImage(String imageUrl) throws IOException {
        if(imageUrl == null || imageUrl.isEmpty()) {
            throw new IllegalArgumentException("Invalid image url");
        }

        // Extract the publicId (cloudinary stores images with unique id)
        String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1).split("\\.")[0];

        // Call cloudinary to delete image
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

}

