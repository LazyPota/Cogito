package com.application.appgaruda.ui.fragment.profile

import androidx.fragment.app.viewModels
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import com.application.appgaruda.R
import com.application.appgaruda.helper.SessionManager

class ProfileFragment : Fragment() {

    private val viewModel: ProfileViewModel by viewModels()
    private lateinit var btnLogOut: Button
    private lateinit var tvUsernameHolder: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        inisialisasi(view)
        handlelistener()
    }

    private fun handlelistener() {
        btnLogOut.setOnClickListener {
            val sessionManager = SessionManager(requireContext())
            sessionManager.clearSession()
        }
    }

    private fun inisialisasi(view: View) {
        btnLogOut = view.findViewById(R.id.btn_log_out)
        tvUsernameHolder = view.findViewById(R.id.tv_username_holder)

        //* set
        val session = SessionManager(requireContext())
        tvUsernameHolder.text = session.getUsername().toString()

    }
}