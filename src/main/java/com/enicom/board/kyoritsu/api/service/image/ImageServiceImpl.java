// package com.enicom.board.kyoritsu.api.service.image;

// import com.enicom.board.kyoritsu.api.param.file.FileInfoParam;
// import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
// import com.enicom.board.kyoritsu.dao.entity.Image;
// import com.enicom.board.kyoritsu.dao.repository.image.ImageRepository;
// import com.enicom.board.kyoritsu.utils.SecurityUtil;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.multipart.MultipartHttpServletRequest;
// import com.enicom.board.kyoritsu.api.service.file.FileService;


// @Service
// public class ImageServiceImpl implements ImageService {

//     private static final String ImagePath = "Image";
//     private final SecurityUtil securityUtil;
//     private final ImageRepository imageRepository;


//     @Autowired
//     public ImageServiceImpl(SecurityUtil securityUtil, ImageRepository imageRepository) {
//         this.securityUtil = securityUtil;
//         this.imageRepository = imageRepository;
//     }

//     @Override
//     public ResponseDataValue<String> upload(MultipartHttpServletRequest request, String name, MultipartFile file) {
//         ResponseDataValue<String> result = FileService.upload(ImagePath, file, name);

//         if (result.getCode() == 200) {
//             String fileName = result.getResult();

//                 Image image = Image.builder()
//                         .imageName(fileName)
//                         .build();

//                 imageRepository.save(image);
//         }
//         return result;
//     }

//     @Override
//     public void download(HttpServletRequest request, HttpServletResponse response, String name) {
//         imageRepository.findByKey(name).ifPresent(Image -> {
//             FileInfoParam param = FileInfoParam.builder().name(Image.getImageName()).build();
//             FileService.download(request, response, ImagePath, param);
//         });
//     }
// }