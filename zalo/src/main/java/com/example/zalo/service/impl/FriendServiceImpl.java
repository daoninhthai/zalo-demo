package com.example.zalo.service.impl;

import com.example.zalo.entity.Friend;
import com.example.zalo.entity.Post;
import com.example.zalo.entity.User;
import com.example.zalo.exception.DuplicateRecordException;
import com.example.zalo.exception.InternalServerException;
import com.example.zalo.exception.NotFoundException;
import com.example.zalo.model.dto.FriendDTO;
import com.example.zalo.model.dto.PostDTO;
import com.example.zalo.model.dto.UserDTO;
import com.example.zalo.model.mapper.FriendMapper;
import com.example.zalo.model.mapper.PostMapper;
import com.example.zalo.model.mapper.UserMapper;
import com.example.zalo.model.request.CreateFriendRequest;
import com.example.zalo.repository.FriendRepository;
import com.example.zalo.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    @Autowired
    public FriendServiceImpl(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

// user
    @Override
    public List<FriendDTO> getAllFriend(int userId) {
        List<Friend> friends =friendRepository.getAllListFriend(userId);
        List<FriendDTO> result = new ArrayList<>();
        for (Friend friend:friends){
            result.add(FriendMapper.toFriendDTO(friend));
        }
        return result;
    }
   //admin
    @Override
    public List<FriendDTO> getAllFriendAccepted() {
        List<Friend> friends =friendRepository.getAllFriendAccepted();
        List<FriendDTO> result = new ArrayList<>();
        for (Friend friend:friends){
            result.add(FriendMapper.toFriendDTO(friend));
        }
        return result;
    }

    //user
    @Override
    public List<FriendDTO> getAllFriendAccepted(int userId) {
        List<Friend> friends =friendRepository.getAllFriend(userId);
        List<FriendDTO> result = new ArrayList<>();
        for (Friend friend:friends){
            result.add(FriendMapper.toFriendDTO(friend));
        }
        return result;
    }
// admin
    @Override
    public List<FriendDTO> getAllFriend() {
        List<Friend> friends =friendRepository.findAll();
        List<FriendDTO> result = new ArrayList<>();
        for (Friend friend:friends){
            result.add(FriendMapper.toFriendDTO(friend));
        }
        return result;
    }


    @Override
    public List<FriendDTO> getAllFriendRequest(int userId) {

        List<Friend> friends =friendRepository.getAllRequestFriend(userId);
        List<FriendDTO> result = new ArrayList<>();
        for (Friend friend:friends){
            result.add(FriendMapper.toFriendDTO(friend));
        }
        return result;
    }

    @Override
    public void createFriendRequest(CreateFriendRequest request,int userAId,int userBId) {
        if(userAId == userBId){
            throw new DuplicateRecordException("You cannot send friend requests to yourself");
        }

        List<Friend> friends= friendRepository.findAll();
        for(Friend f:friends){
            if(f.getUserA().getId()==userAId && f.getUserB().getId()==userBId ){
                if(f.getState().equals("waiting")){
                    throw new DuplicateRecordException("You have sent a friend request to this person before");
                }
                if(f.getState().equals("accepted")){
                    throw new DuplicateRecordException("You and this person are already friends");

                }
            }
        }


        Friend friend = new Friend();
        User userA = new User();
        User userB = new User();

        userA.setId(userAId);
        userB.setId(userBId);

        friend.setUserA(userA);
        friend.setUserB(userB);

        friend= FriendMapper.toFriend(request);
        friend.setUserA(userA);
        friend.setUserB(userB);

        try {
            friendRepository.save(friend);
        } catch (Exception ex) {
            throw new InternalServerException("Can't send friend request");
        }


    }

    @Override
    public void acceptFriendRequest( int id) {
        Optional<Friend> friend = friendRepository.findById(id);
        if (friend.isEmpty()) {
            throw new NotFoundException("No friend request found");
        }


        try {
            String state ="accepted";
            friendRepository.acceptFriendRequest(id,state);
        } catch (Exception ex) {
            throw new InternalServerException("Can't accept request");
        }


    }

    @Override
    public void deleteFriendRequest(int id) {
        Optional<Friend> friend = friendRepository.findById(id);
        if (friend.isEmpty()) {
            throw new NotFoundException("No friend request found");
        }

        try {
            friendRepository.deleteById(id);
        } catch (Exception ex) {
            throw new InternalServerException("Can't delete request");
        }
    }
}
