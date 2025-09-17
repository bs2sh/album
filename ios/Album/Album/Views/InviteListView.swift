//
//  InviteListView.swift
//  Album
//
//  Created by shbaek on 8/19/25.
//
import SwiftUI

struct InviteListView: View {
    @AppStorage("userkey") var userKey: Int?
    @State private var selectedSegment = 100
    @StateObject private var viewModel = InviteListViewModel()
    
    var body: some View {
        VStack {
            Picker("초대", selection: $selectedSegment) {
                Text("보낸초대").tag(100)
                Text("받은초대").tag(200)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            List {
                if selectedSegment == 100 {
                    ForEach(viewModel.sendInviteList) { invite in
                        SendInviteListCell(sendInvite: invite)
                            .listRowInsets(EdgeInsets(top: 15, leading: 5, bottom: 15, trailing: 5))
                    }
                } else {
                    ForEach(viewModel.receiveInviteList) { invite in
                        ReceiveInviteListCell(receiveInvite: invite) { accept in
                            let _ = print("invite appect \(accept)")
                            viewModel.updateInviteState(inviteKey: invite.inviteKey, accept: accept)
                        }
                        .listRowInsets(EdgeInsets(top: 15, leading: 5, bottom: 15, trailing: 5))
                    }
                }
            }
            .buttonStyle(PlainButtonStyle())
            .listStyle(.plain)
        }
        .onAppear {
            if let userKey = userKey {
                viewModel.fetchInviteList(userKey: userKey)
            }
        }
        .alert(viewModel.errMsg ?? "잠시 후 다시 이용해 주세요", isPresented: $viewModel.alert) {
            
        }
        .onChange(of: viewModel.stateUpdated) {
            // 상태 업데이트 되었음. 리스트 다시 받아온다.
            let _ = print("State Updated \(viewModel.stateUpdated)")
            if let userKey = userKey {
                viewModel.fetchInviteList(userKey: userKey)
            }
        }
    }
}

#Preview {
    InviteListView()
}
